import { AuthOTPDto } from '@modules/securityConfig/presentation/dtos';
import { ValidateIfPropertyExists } from '@shared/decorators';
import { emailOrPhoneRegex } from '@shared/regex';
import { Transform } from 'class-transformer';
import { IsDefined, IsString, Length, Matches } from 'class-validator';

// TODO: agregar estas configuraciones a las variables de entorno
export class StepperLoginDto extends AuthOTPDto
{
    @IsString()
    @Matches(emailOrPhoneRegex,
        { message: 'Email or phone number is invalid' })
    @Transform(({ value }) => value.toLowerCase())
    public readonly emailOrPhone: string;

    @IsString()
    @Length(5, 20)
    @ValidateIfPropertyExists()
    public password: string;
}
