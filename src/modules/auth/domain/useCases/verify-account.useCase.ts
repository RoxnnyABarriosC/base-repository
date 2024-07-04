import { VerifiedAccountEvent } from '@modules/common/mail/domain/events';
import { MailEventEnum } from '@modules/common/mail/domain/listeners';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ILocalMessage, SendLocalMessage } from '@shared/app/utils';
import { TokenActionEnum } from '../enums';
import { TokenService } from '../services';

declare interface IActivateAccountUseCaseProps {
    confirmationToken: string
}

@Injectable()
export class VerifyAccountUseCase
{
    private readonly logger = new Logger(VerifyAccountUseCase.name);


    constructor(
        private readonly tokenService: TokenService,
        private readonly repository: UserRepository,
        private readonly eventEmitter: EventEmitter2,
        private readonly configService: ConfigService
    )
    { }

    async handle({ confirmationToken }: IActivateAccountUseCaseProps): Promise<ILocalMessage>
    {
        const { email, action, id } = await this.tokenService.verifyToken(confirmationToken);

        const checkBlackList = this.configService.getOrThrow<boolean>('jwt.checkBlackList');

        if (checkBlackList)
        {
            void await this.tokenService.checkConfirmationTokenInBlackList(id);
        }

        void this.tokenService.validateConfirmationTokenAction(action as any, TokenActionEnum.VERIFY_ACCOUNT);

        const user = await this.repository.getOneBy({
            condition: { email },
            initThrow: true
        });

        user.verify = true;

        void await this.repository.update(user);

        await this.tokenService.setConfirmationTokenBlackListed(id, confirmationToken);

        this.eventEmitter.emit(MailEventEnum.VERIFIED_ACCOUNT, new VerifiedAccountEvent(user));

        return SendLocalMessage(() => 'messages.auth.verifiedAccount');
    }
}
