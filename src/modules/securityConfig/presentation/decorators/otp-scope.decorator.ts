import { OTP_SCOPE, REQUIRED_OTP_PROPERTIES } from '@modules/securityConfig/presentation/guards';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const OTPScope = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) =>
    {
        const request = ctx.switchToHttp().getRequest<FastifyRequest>();

        if (!(OTP_SCOPE in request))
        {
            throw new Error('you need to use one of the following decorators @GetOTPScope()');
        }

        return  request[OTP_SCOPE];
    }
);
