import configuration from '@config/configuration';
import { EmailDomainLength, IsEmailFromDomain, IsNotEmailFromDomain } from '@shared/classValidator/decorators';
import { ContextGroupsEnum } from '@shared/classValidator/enums';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';

const {
    emailDomainLength
} = configuration().validatorProperties;

const emailDomains = configuration().emailsDomain;

export class ChangeMyEmailDto
{
    @IsEmailFromDomain(emailDomains.admin, {
        groups: [ContextGroupsEnum.ADMIN]
    })
    @IsNotEmailFromDomain(emailDomains.admin, {
        groups: [ContextGroupsEnum.APP]
    })
    @EmailDomainLength(emailDomainLength)
    @IsEmail()
    @Transform(({ value }) => value.toLowerCase())
    public readonly email: string;

    @IsString()
    @Length(6, 6)
    public readonly otpCode: string;
}
