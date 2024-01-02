import { OTPSendChannelEnum } from '@modules/securityConfig/domain/enums';
import { emailOrPhoneRegex } from '@shared/regex';
import { Transform } from 'class-transformer';
import { IsEnum, IsString, Matches } from 'class-validator';
import { IsAValidTwilioTo } from '../decorators';

export class SendOTPDto
{
    @IsString()
    @Matches(emailOrPhoneRegex, { message: 'Email or phone number is invalid' })
    @IsAValidTwilioTo()
    @Transform(({ value }) => value.toLowerCase())
    public readonly to: string;

    @IsEnum(OTPSendChannelEnum)
    public readonly channel: OTPSendChannelEnum;
}
