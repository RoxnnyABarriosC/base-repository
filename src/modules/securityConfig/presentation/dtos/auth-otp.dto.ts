import { OTPPropertiesEnum } from '@modules/securityConfig/domain/enums';
import { ValidateIfPropertyExists } from '@shared/decorators';
import { IsOptional, IsString, Length } from 'class-validator';

export class AuthOTPDto
{
    @IsString()
    @Length(6, 6)
    @ValidateIfPropertyExists()
    public [OTPPropertiesEnum.PHONE_OTP_CODE]: string;

    @IsString()
    @Length(6, 6)
    @ValidateIfPropertyExists()
    public [OTPPropertiesEnum.EMAIL_OTP_CODE]: string;
}
