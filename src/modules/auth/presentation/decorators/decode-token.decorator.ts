import { IAuthData } from '@modules/auth/domain/strategies';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const DecodeToken = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) =>
    {
        return ctx.switchToHttp().getRequest<Request & { user: IAuthData }>().user.payload;
    }
);
