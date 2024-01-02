import { SecurityConfig } from '@modules/securityConfig/domain/entities';
import { OTPPropertiesEnum } from '@modules/securityConfig/domain/enums';
import { Serializer } from '@shared/classValidator/abstractClass';
import { EncodeText } from '@shared/utils';
import { Expose } from 'class-transformer';

export class OtpUserConfigSerializer extends Serializer
{
    @Expose()
    public requiredProperties: string[];

    @Expose()
    public email: string;

    @Expose()
    public phone: string;

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
        this.email = EncodeText(data.__user__.email, 'email');
        this.phone = EncodeText(data.__user__.phone, 'phone');
    }
}
