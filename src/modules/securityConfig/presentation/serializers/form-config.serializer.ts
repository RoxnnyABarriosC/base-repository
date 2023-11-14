import { SecurityConfig } from '@modules/securityConfig/domain/entities';
import { OTPPropertiesEnum } from '@modules/securityConfig/domain/enums';
import { Serializer } from '@shared/abstractClass';
import { Expose } from 'class-transformer';


export class FormConfigSerializer extends Serializer
{
    @Expose()
    public requiredProperties: string[];

    @Expose()
    public userId: string;

    override async build(data: SecurityConfig): Promise<void>
    {
        const requiredProperties = [];

        if (data.requiredPassword)
        {
            requiredProperties.push('password');
        }

        if (data.otp.email.enable)
        {
            requiredProperties.push(OTPPropertiesEnum.EMAIL_OTP_CODE);
        }

        if (data.otp.phone.enable)
        {
            requiredProperties.push(OTPPropertiesEnum.PHONE_OTP_CODE);
        }

        this.requiredProperties = requiredProperties;

        this.userId = data.__user__._id;
    }
}
