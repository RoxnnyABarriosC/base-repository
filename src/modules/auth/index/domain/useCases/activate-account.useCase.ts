import { TokenActionEnum } from '@modules/auth/index/domain/enums';
import { TokenService } from '@modules/auth/index/domain/services';
import { UserRepository } from '@modules/auth/user/infrastructure/repositories';
import { ActivatedAccountEvent } from '@modules/common/mail/domain/events';
import { MailEventEnum } from '@modules/common/mail/domain/listeners';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LocalMessageInterface } from '@shared/interfaces';
import { SendLocalMessage } from '@shared/utils';
import { I18nContext } from 'nestjs-i18n';

interface Props {
    confirmationToken: string
}

@Injectable()
export class ActivateAccountUseCase
{
    private readonly logger = new Logger(ActivateAccountUseCase.name);

    constructor(
        private readonly tokenService: TokenService,
        private readonly repository: UserRepository,
        private readonly eventEmitter: EventEmitter2
    )
    { }

    async handle({ confirmationToken }: Props): Promise<LocalMessageInterface>
    {
        const { email, action } = await this.tokenService.verifyToken(confirmationToken);

        void this.tokenService.validateConfirmationTokenAction(action as any, TokenActionEnum.ACTIVATE_ACCOUNT);

        const user = await this.repository.getOneBy({
            condition: { email },
            options: { initThrow: true }
        });

        user.enable = true;

        void await this.repository.update(user);

        this.eventEmitter.emit(MailEventEnum.ACTIVATED_ACCOUNT, new ActivatedAccountEvent(user));

        return SendLocalMessage(() => 'messages.auth.activatedAccount');
    }
}
