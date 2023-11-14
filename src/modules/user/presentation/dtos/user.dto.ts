import { GenderEnum } from '@modules/user/domain/enums';
import { ValidateIfPropertyExists } from '@shared/decorators';
import { IsDateString, IsEmail, IsEnum, IsPhoneNumber, IsString, Length, NotEquals, ValidateIf } from 'class-validator';
import { PasswordDto } from './password.dto';

export class UserDto extends PasswordDto
{
    @IsString()
    @Length(5, 20)
    public readonly userName: string;

    @IsString()
    @Length(3, 20)
    public readonly firstName: string;

    @IsString()
    @Length(3, 20)
    public readonly lastName: string;

    @IsEmail()
    public readonly email: string;

    @IsPhoneNumber()
    public readonly phone: string;

    @IsEnum(GenderEnum)
    public readonly gender: GenderEnum;

    @IsDateString()
    public readonly birthday: Date;
}
