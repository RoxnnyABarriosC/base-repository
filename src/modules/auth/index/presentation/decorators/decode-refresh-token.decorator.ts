import { DecodeTokenInterface } from '@modules/auth/index/domain/models';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const DecodeRefreshToken = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) =>
    {
        return ctx.switchToHttp().getRequest<Request & { decodeRefreshToken: DecodeTokenInterface }>().decodeRefreshToken;
    }
);
