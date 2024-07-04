import { EncryptionFactory } from '@modules/auth/domain/factories';
import { OTPNotFoundException } from '@modules/securityConfig/domain/exceptions';
import { AuthOTPDto } from '@modules/securityConfig/presentation/dtos';
import { User } from '@modules/user/domain/entities';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BadRequestCustomException } from '@shared/app/exceptions';
import { ErrorModel } from '@shared/classValidator/models';
import { EncodeText, GetMilliseconds } from '@shared/utils';
import { Cache } from 'cache-manager';
import { I18nContext } from 'nestjs-i18n';
import { TwilioService as _TwilioService } from 'nestjs-twilio/dist/module/twilio.service';
import { OTPPropertiesToTargetDictionary } from '../dictionaries';
import { SecurityConfig } from '../entities';
import { OTPPropertiesEnum, OTPTargetConfigEnum } from '../enums';

@Injectable()
export class OTPService
{
    private readonly logger = new Logger(OTPService.name);
    public readonly encryption = EncryptionFactory.create();

    constructor(
        private readonly configService: ConfigService,
        private readonly twilioService: _TwilioService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    )
    { }

    getRequiredProperties(securityConfig: SecurityConfig)
    {
        const otpData = securityConfig.otp;

        return Object.keys(otpData)
            .filter(otp => otp.toUpperCase() in OTPTargetConfigEnum && otpData[otp].enable)
            .flatMap(otp => Object.values(OTPPropertiesEnum)
                .filter(value => value.includes(otp)));
    }

    async checkOtp(data: AuthOTPDto, otpProperties: OTPPropertiesEnum[])
    {
        return async(user: User) =>
        {
            const fnCheck = async(otpProperty: OTPPropertiesEnum) =>
            {
                const target = OTPPropertiesToTargetDictionary.get(otpProperty);
                const key = `otp:${target}:${user[target]}`;

                const otherProperties = {
                    [target]: EncodeText(user[target], target)
                };

                const tempCode = await this.cacheManager.get(key) as string;
                let  isValidCode = tempCode === data[otpProperty];

                if (!isValidCode)
                {
                    isValidCode = await this.verifyOTP(user[target], data[otpProperty]);
                }

                if (!isValidCode)
                {
                    return this.createMessage(otpProperty, () => `exceptions.securityConfig.otp.${target}.noMatch`, otherProperties);
                }
                else
                {
                    if (!tempCode)
                    {
                        await this.cacheManager.set(key, data[otpProperty], GetMilliseconds('10m'));
                    }

                    return key;
                }
            };

            const results = await Promise.all(otpProperties.map(fnCheck));

            if (results.some(result => typeof result === 'object'))
            {
                throw new BadRequestCustomException(results.filter(result => typeof result === 'object'));
            }

            await Promise.all(results.map(this.cacheManager.del));
        };
    }

    protected createMessage(attr: string, keyFn = () => 'exceptions.securityConfig.otp.notFound', otherProperties?: object)
    {
        const key = keyFn();
        const message = I18nContext.current().translate(key) as string;

        const constrain = key.split('.').pop();

        return {
            property: attr,
            ...otherProperties,
            constraints: {
                [constrain]: {
                    message,
                    errorCode: key
                }
            }
        } as ErrorModel;
    }

    async verifyOTP(to: string, code: string)
    {
        try
        {
            const res = await this.twilioService
                .client
                .verify
                .v2
                .services(this.configService.getOrThrow('twilio.otpServiceSid'))
                .verificationChecks
                .create({
                    to,
                    code
                });

            return res.valid;
        }
        catch (error)
        {
            this.logger.error(error);
            return false;
        }
    }
}
