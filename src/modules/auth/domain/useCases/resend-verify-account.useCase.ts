import { TokenActionEnum } from '@modules/auth/domain/enums';
import { TokenService } from '@modules/auth/domain/services';
import { VerifyAccountEvent } from '@modules/common/mail/domain/events';
import { MailEventEnum } from '@modules/common/mail/domain/listeners';
import { SecurityConfigRepository } from '@modules/securityConfig/infrastructure/repositories';
import { UserService } from '@modules/user/domain/services';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ILocalMessage, SendLocalMessage } from '@shared/app/utils';
import { IServerConfig } from '@src/config';

declare interface IResendVerifyAccountUseCaseProps {
    email: string;
}

@Injectable()
export class ResendVerifyAccountUseCase
{
    private readonly logger = new Logger(ResendVerifyAccountUseCase.name);

    constructor(
        private readonly tokenService: TokenService,
        private readonly repository: UserRepository,
        private readonly securityConfigRepository: SecurityConfigRepository,
        private readonly service: UserService,
        private readonly configService: ConfigService,
        private readonly eventEmitter: EventEmitter2
    )
    {}

    async handle({ email }: IResendVerifyAccountUseCaseProps): Promise<ILocalMessage>
    {
        const user = await this.repository.findOneByEmailOrPhone({ emailOrPhone: email, initThrow: true });

        const confirmationToken = this.tokenService.createConfirmationToken(
            user.email,
            TokenActionEnum.VERIFY_ACCOUNT
        );

        const {
            url: { web }
        } = this.configService.get<IServerConfig>('server');

        this.eventEmitter.emit(
            MailEventEnum.VERIFY_ACCOUNT,
            new VerifyAccountEvent(
                user,
                `${web}/verify-account?token=${confirmationToken}`
            )
        );

        return SendLocalMessage(() => 'messages.auth.resendVerifyAccount');
    }
}
