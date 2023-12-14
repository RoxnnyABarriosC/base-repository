import { OTPChannelToTargetDictionary } from '@modules/securityConfig/domain/dictionaries';
import { OTPSendChannelEnum } from '@modules/securityConfig/domain/enums';
import { SendOTPEmailEvent, SendOTPPhoneEvent } from '@modules/securityConfig/domain/events';
import { OTPUniqueTargetException } from '@modules/securityConfig/domain/exceptions';
import { TwilioEventEnum } from '@modules/securityConfig/domain/listeners';
import { SendOTPDto } from '@modules/securityConfig/presentation/dtos';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SendLocalMessage } from '@shared/utils';
import { Cache } from 'cache-manager';

interface  ISendPublicOTPUseCaseProps {
    dto: SendOTPDto;
}

@Injectable()
export class SendPublicOTPUseCase
{
    private readonly logger = new Logger(SendPublicOTPUseCase.name);

    constructor(
        private readonly eventEmitter: EventEmitter2,
        private readonly userRepository: UserRepository,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    )
    {}

    async handle({ dto: { channel, to } }: ISendPublicOTPUseCaseProps)
    {
        const target = OTPChannelToTargetDictionary.get(channel);

        const exist  = await this.userRepository.exist({ condition: { [target]: to }, select: ['_id'] });

        if (exist)
        {
            throw new OTPUniqueTargetException(target, to);
        }

        if (channel === OTPSendChannelEnum.SMS)
        {
            this.eventEmitter.emit(TwilioEventEnum.SEND_OTP_PHONE, new SendOTPPhoneEvent(to, channel));
        }

        if (channel === OTPSendChannelEnum.EMAIL)
        {
            this.eventEmitter.emit(TwilioEventEnum.SEND_PUBLIC_OTP_EMAIL, new SendOTPEmailEvent(to, channel));
        }

        return SendLocalMessage(() =>  'messages.otp.sent');
    }
}
