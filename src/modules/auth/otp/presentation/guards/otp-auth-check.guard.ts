import { OtpConfigException } from '@modules/auth/otp/domain/exceptions';
import { OTPService } from '@modules/auth/otp/domain/services';
import { User } from '@modules/auth/user/domain/entities';
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { EncodeText } from '@shared/utils';

export const REQUIRED_OTP_PROPERTIES = 'requiredOtpProperties';

@Injectable()
export class OtpAuthCheckGuard implements CanActivate
{
    private readonly logger = new Logger(OtpAuthCheckGuard.name);

    constructor(private readonly service: OTPService)
    {
    }


    async canActivate(context: ExecutionContext): Promise<boolean>
    {
        const request = context.switchToHttp().getRequest<Request & { user: User }>();

        const {  body, user } = request;

        const bodyProperties = Object.keys(body);

        const requiredOtpProperties = await this.service.getConfigOfUser(user._id);
        const values  = requiredOtpProperties.reduce((prev, otp) =>
        {
            const otpType = this.service.getType(otp);

            return {
                ...prev,
                [otpType]: EncodeText(user[otpType], otpType)
            };
        }, {});

        const existOtpProperties = requiredOtpProperties.every((c) => bodyProperties.some((p) => p === c));

        if (!existOtpProperties)
        {
            throw new OtpConfigException(requiredOtpProperties, values);
        }

        request[REQUIRED_OTP_PROPERTIES] = requiredOtpProperties;

        return true;
    }
}
