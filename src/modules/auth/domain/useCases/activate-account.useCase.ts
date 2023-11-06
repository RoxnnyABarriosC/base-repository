import { TokenActionEnum } from '@modules/auth/domain/enums';
import { TokenService } from '@modules/auth/domain/services';
import { ActivatedAccountEvent } from '@modules/common/mail/domain/events';
import { MailEventEnum } from '@modules/common/mail/domain/listeners';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ILocalMessage } from '@shared/interfaces';
import { SendLocalMessage } from '@shared/utils';

declare interface IActivateAccountUseCaseProps {
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
    {
    }
    async handle({ confirmationToken }: IActivateAccountUseCaseProps): Promise<ILocalMessage>
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
