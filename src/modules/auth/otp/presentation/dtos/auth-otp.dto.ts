import { OtpPropertiesEnum } from '@modules/auth/otp/domain/enums';
import { IsOptional, IsString, Length } from 'class-validator';

export class AuthOtpDto
{
    @IsString()
    @Length(6, 6)
    @IsOptional()
    public [OtpPropertiesEnum.PHONE_OTP_CODE]: string;

    @IsString()
    @Length(6, 6)
    @IsOptional()
    public [OtpPropertiesEnum.EMAIL_OTP_CODE]: string;
}
