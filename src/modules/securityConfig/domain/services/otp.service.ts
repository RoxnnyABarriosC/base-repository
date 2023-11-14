import { BadCredentialsException } from '@modules/auth/domain/exceptions';
import { EncryptionFactory } from '@modules/auth/domain/factories';
import { AuthService } from '@modules/auth/domain/services';
import { SecurityConfig } from '@modules/securityConfig/domain/entities';
import { OTPPropertiesEnum, OTPSendTypeEnum } from '@modules/securityConfig/domain/enums';
import { OTPNotFoundException } from '@modules/securityConfig/domain/exceptions';
import { IOTPRedis } from '@modules/securityConfig/domain/models';
import { SecurityConfigRepository } from '@modules/securityConfig/infrastructure/repositories';
import { AuthOTPDto } from '@modules/securityConfig/presentation/dtos';
import { User } from '@modules/user/domain/entities';
import { DisabledUserException, UserIsNotSuperAdminException } from '@modules/user/domain/exceptions';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { BadRequestCustomException, NotFoundCustomException } from '@shared/exceptions';
import { ErrorModel } from '@shared/models';
import { EncodeText } from '@shared/utils';
import { Cache } from 'cache-manager';
import days from 'dayjs';
import { I18nContext } from 'nestjs-i18n';
import { NotFoundError } from 'rxjs';

interface Iinterface {
    emailOrPhone: string;
    password?: string;
    checkSuperAdmin?:  boolean;
    dataOtp: AuthOTPDto,
    otpProperties: OTPPropertiesEnum[]
}

@Injectable()
export class OTPService
{
    private readonly logger = new Logger(OTPService.name);
    public readonly encryption = EncryptionFactory.create();

    constructor(
        private readonly repository: SecurityConfigRepository,
        private readonly userRepository: UserRepository,
        private readonly authService: AuthService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    )
    { }

    getRequiredProperties(securityConfig: SecurityConfig)
    {
        const otpData = securityConfig.otp;

        return Object.keys(otpData)
            .filter(otp => otp.toUpperCase() in OTPSendTypeEnum && otpData[otp].enable)
            .flatMap(otp => Object.values(OTPPropertiesEnum)
                .filter(value => value.includes(otp)));
    }

    async checkOtp(data: AuthOTPDto, otpProperties: OTPPropertiesEnum[], securityConfig: SecurityConfig, otpKeys: {emailKey: string, phoneKey: string})
    {
        return async(user: User) =>
        {
            const errors = [];

            const otpChecks = otpProperties.map(async(otp) =>
            {
                const otpType = this.getType(otp);
                const key = otpKeys[`${otpType}Key`];

                const otpHash = await this.cacheManager.get<IOTPRedis>(key);

                const otherProperties = {
                    [otpType]: EncodeText(user[otpType], otpType)
                };

                if (!otpHash)
                {
                    errors.push(this.createMessage(otp, () => `exceptions.securityConfig.otp.${otpType}.expired`, otherProperties));
                }
                else
                {
                    if (otpHash?.userId !== user._id || otpHash.target !== otpType)
                    {
                        throw new OTPNotFoundException(otpType);
                    }

                    const verify = await this.encryption.compare(data[otp], otpHash.hash);

                    if (!verify)
                    {
                        errors.push(this.createMessage(otp, () => `exceptions.securityConfig.otp.${otpType}.noMatch`, otherProperties));
                    }
                }
            });

            await Promise.all(otpChecks);

            if (errors.length)
            {
                throw new BadRequestCustomException(errors);
            }
            Object.keys(otpKeys).map(async(key) =>
            {
                if (otpKeys[key])
                {
                    await this.cacheManager.del(otpKeys[key]);
                }
            });
        };
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
}
