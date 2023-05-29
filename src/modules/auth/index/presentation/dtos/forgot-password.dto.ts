import { emailOrPhoneRegex } from '@shared/regex';
import { IsString, Matches } from 'class-validator';

export class ForgotPasswordDto
{
    @IsString()
    @Matches(
        emailOrPhoneRegex,
        { message: 'Email or phone number is invalid' })
    public readonly emailOrPhone: string;
}
