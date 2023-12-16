import configuration from '@config/configuration';
import { OTPPropertiesEnum } from '@modules/securityConfig/domain/enums';
import { ValidateIfPropertyExists } from '@shared/classValidator/decorators';
import { IsString, Length } from 'class-validator';

const { codeLength }  = configuration().otp;

export class AuthOTPDto
{
    @IsString()
    @Length(codeLength, codeLength)
    @ValidateIfPropertyExists()
    public [OTPPropertiesEnum.PHONE_OTP_CODE]: string;

    @IsString()
    @Length(codeLength, codeLength)
    @ValidateIfPropertyExists()
    public [OTPPropertiesEnum.EMAIL_OTP_CODE]: string;
}
