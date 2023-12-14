import { OTPSendChannelEnum } from '@modules/securityConfig/domain/enums';
import { IsAValidTwilioTo } from '@modules/securityConfig/presentation/decorators/is-a-valid-twilio-to.decorator';
import { emailOrPhoneRegex } from '@shared/regex';
import { Transform } from 'class-transformer';
import { IsEnum, IsString, Matches } from 'class-validator';

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
