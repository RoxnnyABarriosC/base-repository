import { AuthDataInterface } from '@modules/auth/index/domain/strategies';
import { User } from '@modules/auth/user/domain/entities';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const AuthUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) =>
    {
        const request = ctx.switchToHttp().getRequest<FastifyRequest & { user: AuthDataInterface | User}>();

        if (!('user' in request))
        {
            throw new Error('you need to use one of the following decorators @LocalAuth() or @Protected()');
        }

        return  ('data' in request.user) ? request.user.data : request.user;
    }
);
