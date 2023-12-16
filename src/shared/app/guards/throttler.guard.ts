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
    protected getTrackerV2(req: FastifyRequest, useUrl = false): string
    {
        let track = req.ips?.length ? req.ips[0] : req.ip;

        if (useUrl)
        {
            track   = `${track}-${req.url}`;
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

        const track = this.getTrackerV2(request, useUrl);
        const key = this.generateKey(context, track);
        const { totalHits } = await this.storageService.increment(key, ttl);

        if (totalHits > limit)
        {
            throw new ThrottlerException();
        }

        return true;
    }
}
