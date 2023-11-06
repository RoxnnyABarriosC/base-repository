import { SendOtpEvent } from '@modules/common/mail/domain/events';
import { MailEventEnum } from '@modules/common/mail/domain/listeners';
import { OtpTypeEnum } from '@modules/otp/domain/enums';
import { SendMessageEvent } from '@modules/otp/domain/events/send-message.event';
import { OtpLimitExceededException } from '@modules/otp/domain/exceptions';
import { OtpDisabledException } from '@modules/otp/domain/exceptions/otp-disabled.exception';
import { TwilioEventEnum } from '@modules/otp/domain/listeners';
import { OTPService } from '@modules/otp/domain/services';
import { OTPRepository } from '@modules/otp/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ILocalMessage } from '@shared/interfaces';
import { OtpGenerator, SendLocalMessage, addTimeToCurrentDate } from '@shared/utils';
import { User } from '@src/modules/user/domain/entities';

interface ISendOtpUseCaseProps {
    target: OtpTypeEnum;
    user: User;
}

@Injectable()
export class SendOtpUseCase
{
    private readonly logger = new Logger(SendOtpUseCase.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly repository: OTPRepository,
        private readonly service: OTPService,
        private readonly eventEmitter: EventEmitter2
    )
    {}

    async handle({ target, user }: ISendOtpUseCaseProps): Promise<ILocalMessage>
    {
        const otp = await user.otp;

        if (!otp.config[target].enable)
        {
            throw new OtpDisabledException(target);
        }

        const limit = this.configService.get<number>('otp.limitAttempts');

        if (otp.config[target].attempts >= limit)
        {
            throw new OtpLimitExceededException(target, limit - otp.config[target].attempts);
        }

        const otpCode = OtpGenerator(6);

        otp.config[target].value = await this.service.encryption.encrypt(otpCode);
        otp.config[target].expireTime = addTimeToCurrentDate(this.configService.get<string>('otp.codeExpire')).toDate();
        otp.config[target].attempts += 1;

        if (target === OtpTypeEnum.PHONE)
        {
            const message = `Your OTP code is ${otpCode}`;
            this.eventEmitter.emit(TwilioEventEnum.SEND_MESSAGE, new SendMessageEvent(message, user.phone));
        }

        if (target === OtpTypeEnum.EMAIL)
        {
            this.eventEmitter.emit(MailEventEnum.SEND_OTP, new SendOtpEvent(user, otpCode));
        }

        await this.repository.update(otp);

        return SendLocalMessage(() => `messages.otp.${target}.send`);
    }
}
