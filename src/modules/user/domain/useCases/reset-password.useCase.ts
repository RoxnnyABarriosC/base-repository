import { TokenActionEnum } from '@modules/auth/domain/enums';
import { TokenService } from '@modules/auth/domain/services';
import { ForgotPasswordEvent } from '@modules/common/mail/domain/events';
import { MailEventEnum } from '@modules/common/mail/domain/listeners';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ILocalMessage, SendLocalMessage } from '@shared/app/utils';
import { IServerConfig } from '@src/config';
import dayjs from 'dayjs';
import { UserService } from '../services';

declare interface IResetPasswordUseCaseProps {
    id: string;
}


@Injectable()
export class ResetPasswordUseCase
{
    private readonly logger = new Logger(ResetPasswordUseCase.name);

    constructor(
        private readonly repository: UserRepository,
        private readonly service: UserService,
        private readonly tokenService: TokenService,
        private readonly eventEmitter: EventEmitter2,
        private readonly configService: ConfigService
    )
    {  }

    async handle({ id }: IResetPasswordUseCaseProps): Promise<ILocalMessage>
    {
        const user = await this.repository.getOne({ id });

        user.passwordRequestedAt = dayjs().utc().toDate();

        void this.repository.update(user);

        const confirmationToken = this.tokenService.createConfirmationToken(
            user.email,
            TokenActionEnum.CHANGE_FORGOT_PASSWORD
        );

        const { url: { web } } = this.configService.get<IServerConfig>('server');

        const urlConfirmationToken = `${web}/auth/change-password?token=${confirmationToken}`;

        this.eventEmitter.emit(
            MailEventEnum.FORGOT_PASSWORD,
            new ForgotPasswordEvent(user, urlConfirmationToken)
        );

        return SendLocalMessage(() => 'messages.user.resetPassword');
    }
}
