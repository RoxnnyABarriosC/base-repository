import { TokenActionEnum } from '@modules/auth/domain/enums';
import { TokenService } from '@modules/auth/domain/services';
import { ResetPasswordEvent } from '@modules/common/mail/domain/events';
import { MailEventEnum } from '@modules/common/mail/domain/listeners';
import { UserService } from '@modules/user/domain/services';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ILocalMessage } from '@shared/interfaces';
import { SendLocalMessage } from '@shared/utils';
import { IServerConfig } from '@src/config';
import passwordGenerator from 'password-generator';

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

        const newPassword = passwordGenerator(15, true, /[\w\d]/);

        user.password = await this.service.preparePassword(newPassword);

        void this.repository.update(user);

        const confirmationToken = this.tokenService.createConfirmationToken(user.email, TokenActionEnum.RESET_PASSWORD);

        const { url: { web } } = this.configService.get<IServerConfig>('server');

        this.eventEmitter.emit(MailEventEnum.RESET_PASSWORD, new ResetPasswordEvent(user, newPassword, `${web}/reset-password?token=${confirmationToken}`));

        return SendLocalMessage(() => 'messages.user.resetPassword');
    }
}
