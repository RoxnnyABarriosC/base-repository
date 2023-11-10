import { REQUIRED_OTP_PROPERTIES } from '@modules/securityConfig/presentation/guards';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const RequiredOTPProperties = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) =>
    {
        const request = ctx.switchToHttp().getRequest<FastifyRequest>();

        if (!(REQUIRED_OTP_PROPERTIES in request))
        {
            throw new Error('you need to use one of the following decorators @OtpAuth()');
        }

        return  request[REQUIRED_OTP_PROPERTIES];
    }
);
