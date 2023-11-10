import { SendOtpEvent, SendPublicOtpEvent } from '@modules/common/mail/domain/events';
import { MailEventEnum } from '@modules/common/mail/domain/listeners';
import { OTPSendTypeEnum } from '@modules/securityConfig/domain/enums';
import { SendMessageEvent } from '@modules/securityConfig/domain/events/send-message.event';
import { OTPLimitExceededException, OTPUniqueTargetException } from '@modules/securityConfig/domain/exceptions';
import { TwilioEventEnum } from '@modules/securityConfig/domain/listeners';
import { OTPModel } from '@modules/securityConfig/domain/models';
import { OTPService } from '@modules/securityConfig/domain/services';
import { SecurityConfigRepository } from '@modules/securityConfig/infrastructure/repositories';
import { SendOTPDto } from '@modules/securityConfig/presentation/dtos';
import { User } from '@modules/user/domain/entities';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IOTPConfig } from '@src/config';
import { Cache } from 'cache-manager';

interface  ISendPublicOTPUseCaseProps {
    target: OTPSendTypeEnum;
    dto: SendOTPDto;
    scope: 'private' | 'public';
}

@Injectable()
export class SendPublicOTPUseCase
{
    private readonly logger = new Logger(SendPublicOTPUseCase.name);

    constructor(
        private readonly service: OTPService,
        private readonly eventEmitter: EventEmitter2,
        private readonly configService: ConfigService,
        private readonly userRepository: UserRepository,
        private readonly repository: SecurityConfigRepository,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    )
    {}

    async handle({ target, dto, scope }: ISendPublicOTPUseCaseProps): Promise<any>
    {
        const { value } = dto;

        let user: User;

        if (scope === 'public')
        {
            const exist  = await this.userRepository.exist({ condition: { [target]: value }, select: ['_id'] });

            if (exist)
            {
                throw new OTPUniqueTargetException(target, value);
            }
        }

        if (scope === 'private')
        {
            user = await this.userRepository.findOneByEmailOrPhone({ emailOrPhone: value, initThrow: true });
        }

        const { expirationTime, ...otpConfig } = this.configService.getOrThrow<IOTPConfig>('otp');

        const otp = new OTPModel(
            expirationTime,
            this.service.encryption.encrypt,
            otpConfig as any
        );

        await otp.build();

        if (user)
        {
            const securityConfig = await user.securityConfig;

            const limit = this.configService.get<number>('otp.limitAttempts');

            if (securityConfig.otp[target].attempts >= limit)
            {
                throw new OTPLimitExceededException(target, limit - securityConfig.otp[target].attempts);
            }

            securityConfig.otp[target].attempts += 1;

            await this.repository.update(securityConfig);
        }

        await this.cacheManager.set(otp.Key, { target, hash: otp.Hash }, otp.ExpirationTime('ms') as number);

        if (target === OTPSendTypeEnum.PHONE)
        {
            const message = `Your OTP code is ${otp.Code}`;
            this.eventEmitter.emit(TwilioEventEnum.SEND_MESSAGE, new SendMessageEvent(message, value));
        }

        if (target === OTPSendTypeEnum.EMAIL)
        {
            this.eventEmitter.emit(MailEventEnum.SEND_PUBLIC_OTP, new SendPublicOtpEvent(value, otp.Code));
        }

        return {
            [`${target}OtpKey`]: otp.Key
        };
    }
}
