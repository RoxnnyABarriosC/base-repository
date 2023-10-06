import { EncryptionFactory } from '@modules/auth/index/domain/factories';
import { OTP } from '@modules/auth/otp/domain/entities';
import { OtpPropertiesEnum, OtpTypeEnum } from '@modules/auth/otp/domain/enums';
import { OTPRepository } from '@modules/auth/otp/infrastructure/repositories';
import { User } from '@modules/auth/user/domain/entities';
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
        private readonly repository: OTPRepository
    )
    { }

    async getConfigOfUser(user: User)
    {
        const otpConfig = await user.otp;
        const otpData = otpConfig.config;

        return Object.keys(otpData)
            .filter(otp => otp.toUpperCase() in OtpTypeEnum && otpData[otp].enable)
            .flatMap(otp => Object.values(OtpPropertiesEnum)
                .filter(value => value.includes(otp)));
    }

    async checkOtp(data: { [key in OtpPropertiesEnum]?: string }, otpProperties: OtpPropertiesEnum[], authUser: User)
    {
        const errors = [];

        const _otp = await authUser.otp;

        const otpChecks = otpProperties.map(async(otp) =>
        {
            const otpType = this.getType(otp);
            const expireTime = days(_otp.config[otpType].expireTime);
            const currentTime = days();
            const expire  =  expireTime.isBefore(currentTime);

            const otherProperties = {
                [otpType]: EncodeText(authUser[otpType], otpType)
            };

            if (expire)
            {
                errors.push(this.createMessage(otp, () => `exceptions.otp.${otpType}.expire`, otherProperties));
            }

            const verify = await this.encryption.compare(data[otp], _otp.config[otpType].value ?? '');

            if (!(verify) && !expire)
            {
                errors.push(this.createMessage(otp, () => `exceptions.otp.${otpType}.noMatch`, otherProperties));
            }
        });

        await Promise.all(otpChecks);

        if (errors.length)
        {
            throw new BadRequestCustomException(errors);
        }

        otpProperties.forEach((otp) => (_otp.config[this.getType(otp)].value = null));

        void await this.repository.update(_otp);
    }

    getType(otpProperty: OtpPropertiesEnum)
    {
        const otpTypes = {
            [OtpPropertiesEnum.PHONE_OTP_CODE]: OtpTypeEnum.PHONE,
            [OtpPropertiesEnum.EMAIL_OTP_CODE]: OtpTypeEnum.EMAIL
        };

        if (!Object.keys(otpTypes).some((o => o === otpProperty)))
        {
            throw new Error(`The ${otpProperty} property does not exist in the definition object for otp types`);
        }

        return otpTypes[otpProperty];
    }

    protected createMessage(attr: string, keyFn = () => 'exceptions.otp.notFound', otherProperties?: object)
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
