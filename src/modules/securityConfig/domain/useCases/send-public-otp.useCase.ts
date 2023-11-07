import { SendPublicOtpEvent } from '@modules/common/mail/domain/events';
import { MailEventEnum } from '@modules/common/mail/domain/listeners';
import { OTPSendTypeEnum } from '@modules/securityConfig/domain/enums';
import { SendMessageEvent } from '@modules/securityConfig/domain/events/send-message.event';
import { OTPUniqueTargetException } from '@modules/securityConfig/domain/exceptions';
import { TwilioEventEnum } from '@modules/securityConfig/domain/listeners';
import { OTPService } from '@modules/securityConfig/domain/services';
import { SendPublicOtpDto } from '@modules/securityConfig/presentation/dtos';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GenerateApiKey, GetMilliseconds, OtpGenerator } from '@shared/utils';
import { Cache } from 'cache-manager';

interface ISendPublicOTPUseCaseProps {
    target: OTPSendTypeEnum;
    dto: SendPublicOtpDto;
    checkUniqueTarget?: boolean;
}

@Injectable()
export class SendPublicOTPUseCase
{
    private readonly logger = new Logger(SendPublicOTPUseCase.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly userRepository: UserRepository,
        private readonly service: OTPService,
        private readonly eventEmitter: EventEmitter2,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    )
    {}

    async handle({ target, dto, checkUniqueTarget = false }: ISendPublicOTPUseCaseProps): Promise<any>
    {
        const { value } = dto;

        if (checkUniqueTarget)
        {
            const exist  = await this.userRepository.exist({ condition: { [target]: value }, select: ['_id'] });

            if (exist)
            {
                throw new OTPUniqueTargetException(target, value);
            }
        }

        const otpCode = OtpGenerator(6);

        const otpKey = GenerateApiKey();

        const otpHash = await this.service.encryption.encrypt(otpCode);

        await this.cacheManager.set(otpKey, otpHash, GetMilliseconds(this.configService.getOrThrow<string>('otp.codeExpire')));

        if (target === OTPSendTypeEnum.PHONE)
        {
            const message = `Your OTP code is ${otpCode}`;
            this.eventEmitter.emit(TwilioEventEnum.SEND_MESSAGE, new SendMessageEvent(message, value));
        }

        if (target === OTPSendTypeEnum.EMAIL)
        {
            this.eventEmitter.emit(MailEventEnum.SEND_PUBLIC_OTP, new SendPublicOtpEvent(value, otpCode));
        }

        return {
            [`${target}OtpKey`]: otpKey
        };
    }
}
