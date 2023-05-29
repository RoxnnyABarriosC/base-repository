import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

export const CORRELATION_ID_HEADER = 'x-correlation-id';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware
{
    private readonly logger = new Logger(CorrelationIdMiddleware.name);

    use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void)
    {
        req[CORRELATION_ID_HEADER] = res.getHeader(CORRELATION_ID_HEADER);
        next();
    }
}
