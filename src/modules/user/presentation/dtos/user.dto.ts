import configuration from '@config/configuration';
import { GenderEnum } from '@modules/user/domain/enums';
import { EmailDomainLength, IsAgeBetween, IsEmailFromDomain, NoMatch, ValidateIfPropertyExists } from '@shared/decorators';
import { ContextGroupsEnum } from '@shared/enums';
import { IsDateString, IsEmail, IsEnum, IsMobilePhone, IsOptional, IsString, Length } from 'class-validator';
import { PasswordDto } from './password.dto';

const {
    firstName,
    lastName,
    emailDomainLength,
    birthday
} = configuration().validatorProperties;


const emailDomains = configuration().emailsDomain;

export class UserDto extends PasswordDto
{
    @IsString()
    @Length(2, 20)
    @ValidateIfPropertyExists()
    public readonly userName: string;

    @IsString()
    @Length(firstName.min, firstName.max)
    public readonly firstName: string;

    @IsString()
    @Length(lastName.min, lastName.max)
    public readonly lastName: string;

    @IsEmailFromDomain(emailDomains.admin.split(','), {
        groups: [ContextGroupsEnum.ADMIN]
    })
    @IsEmailFromDomain(emailDomains.app.split(','), {
        groups: [ContextGroupsEnum.APP]
    })
    @EmailDomainLength(emailDomainLength)
    @IsEmail()
    public readonly email: string;

    @IsMobilePhone()
    @IsOptional()
    public readonly phone: string;

    @IsEnum(GenderEnum)
    @IsOptional()
    public readonly gender: GenderEnum;

    @IsAgeBetween(birthday.min, birthday.max)
    @IsDateString()
    @IsOptional()
    public readonly birthday: Date;
}
