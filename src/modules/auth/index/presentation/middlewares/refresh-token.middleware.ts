import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware
{
    // TODO: Validar a futuro de que plataforma se esta emitiendo la solicitud al server para saber de donde sacar el refresh (cookies o Headers)
    use(req: FastifyRequest & { refreshToken: string }, res: FastifyReply, next: () => void)
    {
        if ('refreshToken' in req.cookies)
        {
            req.refreshToken = req.cookies.refreshToken;
        }

        next();
    }
}
