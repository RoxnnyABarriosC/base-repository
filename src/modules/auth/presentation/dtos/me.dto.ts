import configuration from '@config/configuration';
import { GenderEnum } from '@modules/user/domain/enums';
import { EmailDomainLength, IsAgeBetween, IsEmailFromDomain, IsNotEmailFromDomain, ValidateIfPropertyExists } from '@shared/classValidator/decorators';
import { ContextGroupsEnum } from '@shared/classValidator/enums';
import { IsDateString, IsEmail, IsEnum, IsMobilePhone, IsString, Length } from 'class-validator';

const {
    firstName,
    lastName,
    // emailDomainLength,
    birthday
} = configuration().validatorProperties;

const emailDomains = configuration().emailsDomain;

export class MeDto
{
    @IsString()
    @Length(5, 20)
    @ValidateIfPropertyExists()
    public readonly userName: string;

    @IsString()
    @Length(firstName.min, firstName.max)
    @ValidateIfPropertyExists()
    public readonly firstName: string;

    @IsString()
    @Length(lastName.min, lastName.max)
    @ValidateIfPropertyExists()
    public readonly lastName: string;

    // @IsEmailFromDomain(emailDomains.admin, {
    //     groups: [ContextGroupsEnum.ADMIN]
    // })
    // @IsNotEmailFromDomain(emailDomains.admin, {
    //     groups: [ContextGroupsEnum.APP]
    // })
    // @EmailDomainLength(emailDomainLength)
    // @IsEmail()
    // @ValidateIfPropertyExists()
    // public readonly email: string;

    // @IsMobilePhone()
    // @ValidateIfPropertyExists()
    // public readonly phone: string;

    @IsEnum(GenderEnum)
    @ValidateIfPropertyExists()
    public readonly gender: GenderEnum;

    @IsAgeBetween(birthday.min, birthday.max)
    @IsDateString()
    @ValidateIfPropertyExists()
    public readonly birthday: Date;
}
