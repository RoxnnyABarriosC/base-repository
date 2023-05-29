import configuration from '@config/configuration';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UrisInterface } from '@shared/criterias';
import { FastifyRequest } from 'fastify';


export const Uris = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): UrisInterface =>
    {
        const { server: { prefix } } = configuration();

        const request: FastifyRequest = ctx.switchToHttp().getRequest<FastifyRequest>();

        return {
            fullUrl: `${request.protocol}://${request.hostname}${request.raw.url}`,
            base: `${request.protocol}://${request.hostname}${prefix}`
        };
    }
);
