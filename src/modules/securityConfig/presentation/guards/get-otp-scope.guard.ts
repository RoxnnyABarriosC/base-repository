import { OTPService } from '@modules/securityConfig/domain/services';
import { User } from '@modules/user/domain/entities';
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const ORIGIN_URL_HEADER = 'origin-url';
export const OTP_SCOPE = 'otpScope';

@Injectable()
export class GetOTPScopeGuard implements CanActivate
{
    private readonly logger = new Logger(GetOTPScopeGuard.name);

    constructor(private readonly service: OTPService)
    {
    }


    async canActivate(context: ExecutionContext): Promise<boolean>
    {
        const req = context.switchToHttp().getRequest<FastifyRequest & { user: User }>();

        try
        {
            const url = new URL(req.headers[ORIGIN_URL_HEADER] as string);

            const publicOtpPath = ['/register'];
            const privateOtpPath = ['/login'];

            if (publicOtpPath.includes(url.pathname))
            {
                req[OTP_SCOPE] = 'public';
                return true;
            }

            if (privateOtpPath.includes(url.pathname))
            {
                req[OTP_SCOPE] = 'private';

                return true;
            }

            this.logger.error(`URL path ${url.pathname} not found in public or private OTP paths.`);

            return false;
        }
        catch (e)
        {
            this.logger.error(`Error parsing origin URL: ${e['message']}`);
            return false;
        }
    }
}
