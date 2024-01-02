import { CacheInterceptor as Cache } from '@nestjs/cache-manager';
import { CallHandler, ExecutionContext, Logger } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { map } from 'rxjs/operators';
import { CACHE_NO_AUTH, SKIP_CACHE } from '../decorators';
import { IAppResponse } from './response-interceptor.interface';


export class CacheInterceptor extends Cache
{
    private readonly logger = new Logger(CacheInterceptor.name);

    protected override isRequestCacheable(context: ExecutionContext): boolean
    {
        const http = context.switchToHttp();
        const request = http.getRequest<FastifyRequest>();

        const cacheControl = request.headers['cache-control'] ?? 'cache';

        const skipCache: boolean = this.reflector.getAllAndOverride<boolean>(SKIP_CACHE, [
            context.getHandler(),
            context.getClass()
        ]) ?? cacheControl === 'no-cache';

        return skipCache ? !skipCache : request.method === 'GET';
    }

    protected override trackBy(context: ExecutionContext): string | undefined
    {
        const trackKey = super.trackBy(context);

        if (!trackKey)
        {
            return undefined;
        }

        const cacheNoAuth: boolean = this.reflector.getAllAndOverride<boolean>(CACHE_NO_AUTH, [
            context.getHandler(),
            context.getClass()
        ]) ?? false;

        const request = context.getArgByIndex(0) as FastifyRequest;

        const authorizationToken = request.headers?.authorization?.split(/\s+/)[1];

        return authorizationToken && !cacheNoAuth ? `${authorizationToken}:${trackKey}` : trackKey;
    }

    override async intercept(context: ExecutionContext, next: CallHandler)
    {
        const http = context.switchToHttp();
        const response = http.getResponse<FastifyReply>();

        const cacheKey = this.trackBy(context);

        const isCached = cacheKey ? !!(await this.cacheManager.get(cacheKey)) : false;

        response.header('X-Cached-Response', `${isCached}`);

        return (await super.intercept(context, next)).pipe(
            map((data: IAppResponse) =>
            {
                data.isCached = isCached;

                return data;
            })
        );
    }
}
