import { RequestAuth, SocketAuth } from '@modules/auth/domain/strategies';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const AuthUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) =>
    {
        let request: RequestAuth | SocketAuth = ctx.switchToHttp().getRequest<RequestAuth>();

        if (ctx['contextType'] === 'ws')
        {
            request = ctx.switchToWs().getClient<SocketAuth>();
        }

        if (!('user' in request))
        {
            throw new Error('you need to use one of the following decorators @LocalAuth() or @Protected()');
        }

        return  ('data' in request.user) ? request.user.data : request.user;
    }
);
