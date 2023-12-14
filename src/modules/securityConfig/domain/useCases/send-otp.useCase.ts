import { OTPChannelToTargetDictionary } from '@modules/securityConfig/domain/dictionaries';
import { OTPProvidersEnum, OTPSendChannelEnum, OTPTargetConfigEnum } from '@modules/securityConfig/domain/enums';
import { SendOTPEmailEvent, SendOTPPhoneEvent } from '@modules/securityConfig/domain/events';
import { OTPLimitExceededException, PhoneNotDefinedForOtpSendingException } from '@modules/securityConfig/domain/exceptions';
import { OTPDisabledException } from '@modules/securityConfig/domain/exceptions/otp-disabled.exception';
import { TwilioEventEnum } from '@modules/securityConfig/domain/listeners';
import { OTPService } from '@modules/securityConfig/domain/services';
import { SecurityConfigRepository } from '@modules/securityConfig/infrastructure/repositories';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SendLocalMessage } from '@shared/utils';
import { Cache } from 'cache-manager';

interface ISendOTPUseCaseProps {
    channel: OTPSendChannelEnum;
    userId: string;
    countAttempts?: boolean
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

    async handle({ channel, userId, countAttempts = false }: ISendOTPUseCaseProps)
    {
        const user = await this.userRepository.getOne({ id: userId });

        const securityConfig = await user.securityConfig;

        const target = OTPChannelToTargetDictionary.get(channel);

        if (!securityConfig.otp[target].enable)
        {
            throw new OTPDisabledException(target);
        }

        if (target === OTPTargetConfigEnum.PHONE && !(user?.phone))
        {
            throw new PhoneNotDefinedForOtpSendingException();
        }

        if (countAttempts)
        {
            const limit = this.configService.get<number>('otp.limitAttempts');

            if (securityConfig.otpAttempts >= limit)
            {
                throw new OTPLimitExceededException(target, limit - securityConfig.otpAttempts);
            }

            securityConfig.otpAttempts += 1;
        }

        if (channel === OTPSendChannelEnum.SMS || channel === OTPSendChannelEnum.CALL || channel === OTPSendChannelEnum.WHATSAPP)
        {
            const whatsappChannel = securityConfig
                .otp[target].providers.find(p =>  p === OTPProvidersEnum.WHATSAPP &&
              channel !== OTPSendChannelEnum.CALL) as unknown as OTPSendChannelEnum.WHATSAPP;

            this.eventEmitter.emit(TwilioEventEnum.SEND_OTP_PHONE, new SendOTPPhoneEvent(user.phone, whatsappChannel ?? channel));
        }

        if (channel === OTPSendChannelEnum.EMAIL)
        {
            this.eventEmitter.emit(TwilioEventEnum.SEND_OTP_EMAIL, new SendOTPEmailEvent(user.email, channel, user.FullName));
        }

        void await this.repository.update(securityConfig);

        return SendLocalMessage(() =>  'messages.securityConfig.otp.sent');
    }
}
