import { EncryptionFactory } from '@modules/auth/domain/factories';
import { OTPPropertiesEnum, OTPSendTypeEnum } from '@modules/securityConfig/domain/enums';
import { SecurityConfigRepository } from '@modules/securityConfig/infrastructure/repositories';
import { AuthOtpDto } from '@modules/securityConfig/presentation/dtos';
import { User } from '@modules/user/domain/entities';
import { Injectable, Logger } from '@nestjs/common';
import { BadRequestCustomException } from '@shared/exceptions';
import { EncodeText } from '@shared/utils';
import days from 'dayjs';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class OTPService
{
    private readonly logger = new Logger(OTPService.name);
    public readonly encryption = EncryptionFactory.create();

    constructor(
        private readonly repository: SecurityConfigRepository
    )
    { }

    async getConfigOfUser(user: User)
    {
        const securityConfig = await user.securityConfig;
        const otpData = securityConfig.otp;

        return Object.keys(otpData)
            .filter(otp => otp.toUpperCase() in OTPSendTypeEnum && otpData[otp].enable)
            .flatMap(otp => Object.values(OTPPropertiesEnum)
                .filter(value => value.includes(otp)));
    }

    async checkOtp(data: AuthOtpDto, otpProperties: OTPPropertiesEnum[], authUser: User)
    {
        const errors = [];

        const securityConfig = (await authUser.securityConfig);

        const otpChecks = otpProperties.map(async(otp) =>
        {
            const otpType = this.getType(otp);
            const expireTime = days(securityConfig.otp[otpType].expireTime);
            const currentTime = days();
            const expire  =  expireTime.isBefore(currentTime);

            const otherProperties = {
                [otpType]: EncodeText(authUser[otpType], otpType)
            };

            if (expire)
            {
                errors.push(this.createMessage(otp, () => `exceptions.securityConfig.otp.${otpType}.expired`, otherProperties));
            }

            const verify = await this.encryption.compare(data[otp], securityConfig.otp[otpType].value ?? '');

            if (!(verify) && !expire)
            {
                errors.push(this.createMessage(otp, () => `exceptions.securityConfig.otp.${otpType}.noMatch`, otherProperties));
            }
        });

        await Promise.all(otpChecks);

        if (errors.length)
        {
            throw new BadRequestCustomException(errors);
        }

        otpProperties.forEach((otp) =>
        {
            securityConfig.otp[this.getType(otp)].value = null;
            securityConfig.otp[this.getType(otp)].expireTime = null;
        });

        void await this.repository.update(securityConfig);
    }

    getType(otpProperty: OTPPropertiesEnum)
    {
        const otpTypes = {
            [OTPPropertiesEnum.PHONE_OTP_CODE]: OTPSendTypeEnum.PHONE,
            [OTPPropertiesEnum.EMAIL_OTP_CODE]: OTPSendTypeEnum.EMAIL
        };

        if (!Object.keys(otpTypes).some((o => o === otpProperty)))
        {
            throw new Error(`The ${otpProperty} property does not exist in the definition object for otp types`);
        }

        return otpTypes[otpProperty];
    }

    protected createMessage(attr: string, keyFn = () => 'exceptions.securityConfig.otp.notFound', otherProperties?: object)
    {
        const key = keyFn();
        const message = I18nContext.current().translate(key) as string;

        return {
            property: attr,
            message,
            errorCode: key,
            ...otherProperties
        };
    }
}
