import { GenderEnum } from '@modules/user/domain/enums';
import { ValidateIfPropertyExists } from '@shared/decorators';
import { IsDateString, IsEmail, IsEnum, IsPhoneNumber, IsString, Length, NotEquals, ValidateIf } from 'class-validator';
import { PasswordDto } from './password.dto';

export class UserDto extends PasswordDto
{
    @IsString()
    @Length(5, 20)
    @ValidateIfPropertyExists({ groups: ['OPTIONAL'] })
    @IsString()
    @Length(5, 20)
    public readonly userName: string;

    @IsString()
    @Length(3, 20)
    @ValidateIfPropertyExists({ groups: ['OPTIONAL'] })
    public readonly firstName: string;

    @IsString()
    @Length(3, 20)
    @ValidateIfPropertyExists({ groups: ['OPTIONAL'] })
    public readonly lastName: string;

    @IsEmail()
    @ValidateIfPropertyExists({ groups: ['OPTIONAL'] })
    public readonly email: string;

    @IsPhoneNumber()
    @ValidateIfPropertyExists({ groups: ['OPTIONAL'] })
    public readonly phone: string;

    @IsEnum(GenderEnum)
    @ValidateIfPropertyExists({ groups: ['OPTIONAL'] })
    public readonly gender: GenderEnum;

    @IsDateString()
    @ValidateIfPropertyExists({ groups: ['OPTIONAL'] })
    public readonly birthday: Date;
}
