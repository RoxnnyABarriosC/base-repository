import { OTPConfigException } from '@modules/securityConfig/domain/exceptions';
import { OTPService } from '@modules/securityConfig/domain/services';
import { User } from '@modules/user/domain/entities';
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { EncodeText } from '@shared/utils';

export const REQUIRED_OTP_PROPERTIES = 'requiredOtpProperties';

@Injectable()
export class OTPAuthCheckGuard implements CanActivate
{
    private readonly logger = new Logger(OTPAuthCheckGuard.name);

    constructor(private readonly service: OTPService)
    {
    }


    async canActivate(context: ExecutionContext): Promise<boolean>
    {
        const request = context.switchToHttp().getRequest<Request & { user: User }>();

        const {  body, user } = request;

        const bodyProperties = Object.keys(body);

        const requiredOtpProperties = this.service.getRequiredProperties(await user.securityConfig);

        request[REQUIRED_OTP_PROPERTIES] = requiredOtpProperties;

        if (!requiredOtpProperties.length)
        {
            return true;
        }

        const values  = requiredOtpProperties.reduce((prev, otp) =>
        {
            const otpType = this.service.getType(otp);

            return {
                ...prev,
                [otpType]: EncodeText(user[otpType], otpType)
            };
        }, {});

        const existOtpProperties = requiredOtpProperties.every((c) => bodyProperties.includes(c));

        if (!existOtpProperties || !requiredOtpProperties.some(c => !!body[c]))
        {
            throw new OTPConfigException(requiredOtpProperties, values);
        }

        return true;
    }
}
