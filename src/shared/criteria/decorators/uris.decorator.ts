import configuration from '@config/configuration';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { IUris } from '../pagination.criteria';

export const Uris = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): IUris =>
    {
        const { server: { prefix } } = configuration();

        const request: FastifyRequest = ctx.switchToHttp().getRequest<FastifyRequest>();

        return {
            fullUrl: `${request.protocol}://${request.hostname}${request.raw.url}`,
            base: `${request.protocol}://${request.hostname}${prefix}`
        };
    }
);
