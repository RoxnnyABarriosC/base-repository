import { ExecutionContext, Injectable } from '@nestjs/common';
import {
    ThrottlerException,
    ThrottlerGuard as _ThrottlerGuard
} from '@nestjs/throttler';
import { FastifyRequest } from 'fastify';
import { THROTTLE_USE_URL } from '../decorators';

@Injectable()
export class ThrottlerGuard extends _ThrottlerGuard
{
    protected getTrackerHttp(req: FastifyRequest, useUrl = false): string
    {
        let track = req.ips?.length ? req.ips[0] : req.ip;

        if (useUrl)
        {
            track   = `${track}-${req.url}`;
        }

        return track;
    }

    protected getTrackerWs(context: ExecutionContext, useUrl = false): string
    {
        const client = context.switchToWs().getClient();

        let track = client.client.conn.remoteAddress;

        if (useUrl)
        {
            track   = `${track}-${context.getArgByIndex(3)}`;
        }

        return track;
    }

    override async handleRequest(
        context: ExecutionContext,
        limit: number,
        ttl: number
    ): Promise<boolean>
    {
        const http = context.switchToHttp();
        const request = http.getRequest<FastifyRequest>();

        const useUrl: boolean = this.reflector.getAllAndOverride<boolean>(THROTTLE_USE_URL, [
            context.getHandler(),
            context.getClass()
        ]) ?? false;

        let track = this.getTrackerHttp(request, useUrl);

        if (context['contextType'] === 'ws')
        {
            track = this.getTrackerWs(context, useUrl);
        }

        const key = this.generateKey(context, track);

        const { totalHits } = await this.storageService.increment(key, ttl);

        if (totalHits > limit)
        {
            throw new ThrottlerException();
        }

        return true;
    }
}
