import { ForgotPasswordDto } from '@modules/auth/presentation/dtos';
import { ForgotPasswordEvent } from '@modules/common/mail/domain/events';
import { MailEventEnum } from '@modules/common/mail/domain/listeners';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ILocalMessage, SendLocalMessage } from '@shared/app/utils';
import { IServerConfig } from '@src/config';
import dayjs from 'dayjs';
import { TokenActionEnum } from '../enums';
import { TokenService } from '../services';

declare interface IForgotPasswordUseCaseProps {
    dto: ForgotPasswordDto;
}

@Injectable()
export class ForgotPasswordUseCase
{
    private readonly logger = new Logger(ForgotPasswordUseCase.name);

    constructor(
        private readonly tokenService: TokenService,
        private readonly userRepository: UserRepository,
        private readonly eventEmitter: EventEmitter2,
        private readonly configService: ConfigService
    )
    {}

    async handle({ dto: { emailOrPhone } }: IForgotPasswordUseCaseProps): Promise<ILocalMessage>
    {
        const user = await this.userRepository.findOneByEmailOrPhone({
            emailOrPhone,
            initThrow: true
        });

        user.passwordRequestedAt = dayjs().utc().toDate();

        void (await this.userRepository.update(user));

        const confirmationToken = this.tokenService.createConfirmationToken(
            user.email,
            TokenActionEnum.CHANGE_FORGOT_PASSWORD
        );

        const {
            url: { web }
        } = this.configService.get<IServerConfig>('server');

        const urlConfirmationToken = `${web}/auth/change-forgot-password?token=${confirmationToken}`;

        this.eventEmitter.emit(
            MailEventEnum.FORGOT_PASSWORD,
            new ForgotPasswordEvent(user, urlConfirmationToken)
        );

        return SendLocalMessage(() => 'messages.auth.forgotPassword');
    }
}
