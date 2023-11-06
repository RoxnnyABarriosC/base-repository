import { AuthOtpDto } from '@modules/otp/presentation/dtos';
import { emailOrPhoneRegex } from '@shared/regex';
import { Transform } from 'class-transformer';
import { IsString, Length, Matches } from 'class-validator';

// TODO: agregar estas configuraciones a las variables de entorno
export class LoginDto extends AuthOtpDto
{
    @IsString()
    @Matches(emailOrPhoneRegex,
        { message: 'Email or phone number is invalid' })
    @Transform(({ value }) => value.toLowerCase())
    public readonly emailOrPhone: string;

    @IsString()
    @Length(5, 20)
    public password: string;
}
