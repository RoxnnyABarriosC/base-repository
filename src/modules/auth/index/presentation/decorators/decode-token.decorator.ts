import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { AuthDataInterface } from '../../domain/strategies/jwt.strategy';

export const DecodeToken = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) =>
    {
        return ctx.switchToHttp().getRequest<Request & { user: AuthDataInterface }>().user.payload;
    }
);
