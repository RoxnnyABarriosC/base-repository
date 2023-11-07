import { GenderEnum } from '@modules/user/domain/enums';
import { ValidateIfPropertyExists } from '@shared/decorators';
import { IsDateString, IsEmail, IsEnum, IsPhoneNumber, IsString, Length } from 'class-validator';

export class MeDto
{
    @IsString()
    @Length(5, 20)
    @ValidateIfPropertyExists()
    public readonly userName: string;

    @IsString()
    @Length(3, 20)
    @ValidateIfPropertyExists()
    public readonly firstName: string;

    @IsString()
    @Length(3, 20)
    @ValidateIfPropertyExists()
    public readonly lastName: string;

    @IsEmail()
    @ValidateIfPropertyExists()
    public readonly email: string;

    @IsPhoneNumber()
    @ValidateIfPropertyExists()
    public readonly phone: string;

    @IsEnum(GenderEnum)
    @ValidateIfPropertyExists()
    public readonly gender: GenderEnum;

    @IsDateString()
    @ValidateIfPropertyExists()
    public readonly birthday: Date;
}
