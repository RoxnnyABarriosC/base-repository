import { emailOrPhoneRegex } from '@shared/regex';
import { Transform } from 'class-transformer';
import { IsString, Matches } from 'class-validator';

export class SendPublicOtpDto
{
    @IsString()
    @Matches(emailOrPhoneRegex, { message: 'Email or phone number is invalid' })
    @Transform(({ value }) => value.toLowerCase())
    public readonly value: string;
}
