import configuration from '@config/configuration';
import { OTPTargetConfigEnum } from '@modules/securityConfig/domain/enums';
import { PasswordDto } from '@modules/user/presentation/dtos';
import { IsEmailFromDomain, IsNotEmailFromDomain } from '@shared/classValidator/decorators';
import { ContextGroupsEnum } from '@shared/classValidator/enums';
import { emailOrPhoneRegexV2 } from '@shared/regex';
import { Transform } from 'class-transformer';
import { IsEnum, IsString, Length, Matches } from 'class-validator';

const domains = configuration().emailsDomain.admin;

export class  OTPForgotPasswordDto extends PasswordDto
{
    @IsEmailFromDomain(domains, {
        groups: [ContextGroupsEnum.ADMIN]
    })
    @IsNotEmailFromDomain(domains, {
        groups: [ContextGroupsEnum.APP]
    })
    @Matches(emailOrPhoneRegexV2,
        { message: 'Email or phone number is invalid' })
    @Transform(({ value }) => value.toLowerCase())
    public readonly emailOrPhone: string;

    @IsString()
    @Length(6, 6)
    public readonly otpCode: string;
}
