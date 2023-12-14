import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const OauthPayload = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) =>
    {
        return ctx.switchToHttp().getRequest<FastifyRequest & { user: any }>().user;
    }
);
