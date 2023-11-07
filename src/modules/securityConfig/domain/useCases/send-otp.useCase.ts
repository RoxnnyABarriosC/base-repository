import { SendOtpEvent } from '@modules/common/mail/domain/events';
import { MailEventEnum } from '@modules/common/mail/domain/listeners';
import { OTPSendTypeEnum } from '@modules/securityConfig/domain/enums';
import { SendMessageEvent } from '@modules/securityConfig/domain/events/send-message.event';
import { OTPLimitExceededException } from '@modules/securityConfig/domain/exceptions';
import { OTPDisabledException } from '@modules/securityConfig/domain/exceptions/otp-disabled.exception';
import { TwilioEventEnum } from '@modules/securityConfig/domain/listeners';
import { OTPModel } from '@modules/securityConfig/domain/models';
import { OTPService } from '@modules/securityConfig/domain/services';
import { SecurityConfigRepository } from '@modules/securityConfig/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ILocalMessage } from '@shared/interfaces';
import { SendLocalMessage } from '@shared/utils';
import { User } from '@src/modules/user/domain/entities';

interface ISendOTPUseCaseProps {
    target: OTPSendTypeEnum;
    user: User;
}

@Injectable()
export class SendOTPUseCase
{
    private readonly logger = new Logger(SendOTPUseCase.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly repository: SecurityConfigRepository,
        private readonly service: OTPService,
        private readonly eventEmitter: EventEmitter2
    )
    {}

    async handle({ target, user }: ISendOTPUseCaseProps): Promise<ILocalMessage>
    {
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

        const otp = new OTPModel(
            this.configService.getOrThrow<string>('otp.expirationTime'),
            this.service.encryption.encrypt
        );

        await otp.build();

        securityConfig.otp[target].value = otp.Hash;
        securityConfig.otp[target].expireTime = otp.ExpirationTime('date') as Date;
        securityConfig.otp[target].attempts += 1;

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

        return SendLocalMessage(() => `messages.securityConfig.otp.${target}.send`);
    }
}
