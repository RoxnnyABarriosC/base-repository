import configuration from '@config/configuration';
import { IsEmailFromDomain, IsNotEmailFromDomain } from '@shared/classValidator/decorators';
import { ContextGroupsEnum } from '@shared/classValidator/enums';
import { emailOrPhoneRegex } from '@shared/regex';
import { Transform } from 'class-transformer';
import { Matches } from 'class-validator';

const emailDomains = configuration().emailsDomain;

export class ForgotPasswordDto
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
}
