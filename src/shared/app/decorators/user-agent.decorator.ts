import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Details } from 'express-useragent';
import { FastifyRequest } from 'fastify';

export type Agent = Details;

export const UserAgent = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): Agent  =>
    {
        return ctx.switchToHttp().getRequest<FastifyRequest & { raw: { useragent: Agent }}>().raw.useragent;
    }
);
