import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { CORRELATION_ID_HEADER, REAL_IP } from '@shared/app/constants';
import { FastifyReply, FastifyRequest } from 'fastify';


@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware
{
    private readonly logger = new Logger(CorrelationIdMiddleware.name);

    use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void)
    {
        req[CORRELATION_ID_HEADER] = res.getHeader(CORRELATION_ID_HEADER);
        req[REAL_IP] = req.headers['cf-connecting-ip'] ||
            req.headers['x-real-ip'] ||
            req.headers['x-forwarded-for'] ||
            req.socket.remoteAddress || '';

        next();
    }
}
