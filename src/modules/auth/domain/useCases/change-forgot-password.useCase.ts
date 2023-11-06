import { TokenActionEnum } from '@modules/auth/domain/enums';
import { TokenService } from '@modules/auth/domain/services';
import { ChangeForgotPasswordEvent } from '@modules/common/mail/domain/events';
import { MailEventEnum } from '@modules/common/mail/domain/listeners';
import { UserService } from '@modules/user/domain/services';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { PasswordDto } from '@modules/user/presentation/dtos';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ILocalMessage } from '@shared/interfaces';
import { SendLocalMessage } from '@shared/utils';
import { IServerConfig } from '@src/config';

declare interface IChangeForgotPasswordUseCaseProps {
    dto: PasswordDto,
    confirmationToken: string
}

@Injectable()
export class ChangeForgotPasswordUseCase
{
    private readonly logger = new Logger(ChangeForgotPasswordUseCase.name);

    constructor(
        private readonly tokenService: TokenService,
        private readonly userRepository: UserRepository,
        private readonly eventEmitter: EventEmitter2,
        private readonly configService: ConfigService,
        private readonly userService: UserService
    )
    { }

    async handle({ dto: { password }, confirmationToken }: IChangeForgotPasswordUseCaseProps): Promise<ILocalMessage>
    {
        const { email, action } = await this.tokenService.verifyToken(confirmationToken);

        void this.tokenService.validateConfirmationTokenAction(action as any, TokenActionEnum.CHANGE_FORGOT_PASSWORD);

        const user = await this.userRepository.getOneBy({
            condition: { email },
            options: { initThrow: true }
        });

        user.passwordRequestedAt = null;

        user.password = await this.userService.preparePassword(password);

        void await this.userRepository.update(user);

        const { url: { web } } = this.configService.get<IServerConfig>('server');

        this.eventEmitter.emit(MailEventEnum.CHANGE_FORGOT_PASSWORD, new ChangeForgotPasswordEvent(user));

        return SendLocalMessage(() => 'messages.auth.changeForgotPassword');
    }
}
