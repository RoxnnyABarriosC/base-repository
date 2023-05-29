import { TokenActionEnum } from '@modules/auth/index/domain/enums';
import { TokenService } from '@modules/auth/index/domain/services';
import { UserService } from '@modules/auth/user/domain/services';
import { UserRepository } from '@modules/auth/user/infrastructure/repositories';
import { ResetPasswordEvent } from '@modules/common/mail/domain/events';
import { MailEventEnum } from '@modules/common/mail/domain/listeners';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LocalMessageInterface } from '@shared/interfaces';
import { SendLocalMessage } from '@shared/utils';
import { ServerInterface } from '@src/config';
import passwordGenerator from 'password-generator';

interface Props {
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

    async handle({ id }: Props): Promise<LocalMessageInterface>
    {
        const user = await this.repository.getOne({ id });
        void this.service.checkSuperAdmin(user);

        const newPassword = passwordGenerator(15, true, /[\w\d]/);

        user.password = await this.service.preparePassword(newPassword);

        void this.repository.update(user);

        const confirmationToken = this.tokenService.createConfirmationToken(user.email, TokenActionEnum.RESET_PASSWORD);

        const { url: { web } } = this.configService.get<ServerInterface>('server');

        this.eventEmitter.emit(MailEventEnum.RESET_PASSWORD, new ResetPasswordEvent(user, newPassword, `${web}/reset-password?token=${confirmationToken}`));

        return SendLocalMessage(() => 'messages.user.resetPassword');
    }
}
