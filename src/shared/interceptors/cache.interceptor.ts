import { CacheInterceptor as Cache } from '@nestjs/cache-manager';
import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const SKIP_CACHE = 'skip_cache';
export const SkipCache = () => SetMetadata(SKIP_CACHE, true);

export class CacheInterceptor extends Cache
{
    protected override isRequestCacheable(context: ExecutionContext): boolean
    {
        const http = context.switchToHttp();
        const request = http.getRequest<FastifyRequest>();

        const cacheControl = request.headers['cache-control'] ?? 'cache';

        const skipCache: boolean = this.reflector.getAllAndOverride(SKIP_CACHE, [
            context.getHandler(),
            context.getClass
        ]) ?? cacheControl === 'no-cache';

        return skipCache ? !skipCache : request.method === 'GET';
    }
}
