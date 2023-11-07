import { OTPPropertiesEnum } from '@modules/securityConfig/domain/enums';
import { IsOptional, IsString, Length } from 'class-validator';

export class AuthOtpDto
{
    @IsString()
    @Length(6, 6)
    @IsOptional()
    public [OTPPropertiesEnum.PHONE_OTP_CODE]: string;

    @IsString()
    @Length(6, 6)
    @IsOptional()
    public [OTPPropertiesEnum.EMAIL_OTP_CODE]: string;
}
