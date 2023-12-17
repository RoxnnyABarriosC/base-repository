import configuration from '@config/configuration';
import { AuthOTPDto } from '@modules/securityConfig/presentation/dtos';
import { IsEmailFromDomain, IsNotEmailFromDomain, ValidateIfPropertyExists } from '@shared/classValidator/decorators';
import { ContextGroupsEnum } from '@shared/classValidator/enums';
import { emailOrPhoneRegex } from '@shared/regex';
import { Transform } from 'class-transformer';
import { IsString, Length, Matches } from 'class-validator';

const {
    password
} = configuration().validatorProperties;

const emailDomains = configuration().emailsDomain;

export class OTPLoginDto extends AuthOTPDto
{
    @IsEmailFromDomain(emailDomains.admin, {
        groups: [ContextGroupsEnum.ADMIN]
    })
    @IsNotEmailFromDomain(emailDomains.admin, {
        groups: [ContextGroupsEnum.APP]
    })
    @Matches(
        emailOrPhoneRegex,
        { message: 'Email or phone number is invalid' })
    @Transform(({ value }) => value.toLowerCase())
    public readonly emailOrPhone: string;

    @IsString()
    @Length(password.min, password.max)
    @ValidateIfPropertyExists()
    public password: string;
}
