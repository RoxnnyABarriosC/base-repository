import { SendOtpEvent } from '@modules/common/mail/domain/events';
import { MailEventEnum } from '@modules/common/mail/domain/listeners';
import { OTPSendTypeEnum } from '@modules/securityConfig/domain/enums';
import { SendMessageEvent } from '@modules/securityConfig/domain/events/send-message.event';
import { OTPLimitExceededException } from '@modules/securityConfig/domain/exceptions';
import { OTPDisabledException } from '@modules/securityConfig/domain/exceptions/otp-disabled.exception';
import { TwilioEventEnum } from '@modules/securityConfig/domain/listeners';
import { IOTPRedis, OTPModel } from '@modules/securityConfig/domain/models';
import { OTPService } from '@modules/securityConfig/domain/services';
import { SecurityConfigRepository } from '@modules/securityConfig/infrastructure/repositories';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IOTPConfig } from '@src/config';
import { Cache } from 'cache-manager';

interface ISendOTPUseCaseProps {
    target: OTPSendTypeEnum;
    userId: string;
}

@Injectable()
export class SendOTPUseCase
{
    private readonly logger = new Logger(SendOTPUseCase.name);

    constructor(
        private readonly service: OTPService,
        private readonly eventEmitter: EventEmitter2,
        private readonly configService: ConfigService,
        private readonly repository: SecurityConfigRepository,
        private readonly userRepository: UserRepository,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    )
    {}

    async handle({ target, userId }: ISendOTPUseCaseProps)
    {
        const user = await this.userRepository.getOne({ id: userId });

        const securityConfig = await user.securityConfig;

        if (!securityConfig.otp[target].enable)
        {
            throw new OTPDisabledException(target);
        }

        const limit = this.configService.get<number>('otp.limitAttempts');

        if (securityConfig.otp[target].attempts >= limit)
        {
            throw new OTPLimitExceededException(target, limit - securityConfig.otp[target].attempts);
        }

        const { expirationTime, ...otpConfig } = this.configService.getOrThrow<IOTPConfig>('otp');

        const otp = new OTPModel(
            expirationTime,
            this.service.encryption.encrypt,
            otpConfig as any
        );

        await otp.build();

        securityConfig.otp[target].attempts += 1;

        await this.cacheManager.set(otp.Key, { target, hash: otp.Hash, userId } as IOTPRedis, otp.ExpirationTime('ms') as number);

        if (target === OTPSendTypeEnum.PHONE)
        {
            const message = `Your OTP code is ${otp.Code}`;
            this.eventEmitter.emit(TwilioEventEnum.SEND_MESSAGE, new SendMessageEvent(message, user.phone));
        }

        if (target === OTPSendTypeEnum.EMAIL)
        {
            this.eventEmitter.emit(MailEventEnum.SEND_OTP, new SendOtpEvent(user, otp.Code));
        }

        await this.repository.update(securityConfig);

        return {
            [`${target}OtpKey`]: otp.Key
        };
    }
}
