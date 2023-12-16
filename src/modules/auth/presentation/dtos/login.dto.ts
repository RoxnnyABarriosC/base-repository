import configuration from '@config/configuration';
import { emailOrPhoneRegex } from '@shared/regex';
import { Transform } from 'class-transformer';
import { IsString, Length, Matches } from 'class-validator';

const {
    password
} = configuration().validatorProperties;

export class LoginDto
{
    @IsString()
    @Matches(emailOrPhoneRegex,
        { message: 'Email or phone number is invalid' })
    @Transform(({ value }) => value.toLowerCase())
    public readonly emailOrPhone: string;

    @IsString()
    @Length(password.min, password.max)
    public password: string;
}
