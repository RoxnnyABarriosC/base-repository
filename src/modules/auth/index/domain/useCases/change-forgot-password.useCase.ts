import { TokenActionEnum } from '@modules/auth/index/domain/enums';
import { TokenService } from '@modules/auth/index/domain/services';
import { UserService } from '@modules/auth/user/domain/services';
import { UserRepository } from '@modules/auth/user/infrastructure/repositories';
import { PasswordDto } from '@modules/auth/user/presentation/dtos';
import { ChangeForgotPasswordEvent } from '@modules/common/mail/domain/events';
import { MailEventEnum } from '@modules/common/mail/domain/listeners';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LocalMessageInterface } from '@shared/interfaces';
import { SendLocalMessage } from '@shared/utils';
import { ServerInterface } from '@src/config';
import { I18nContext } from 'nestjs-i18n';

interface Props {
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

    async handle({ password }: PasswordDto, confirmationToken: string): Promise<LocalMessageInterface>
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

        const { url: { web } } = this.configService.get<ServerInterface>('server');

        this.eventEmitter.emit(MailEventEnum.CHANGE_FORGOT_PASSWORD, new ChangeForgotPasswordEvent(user));

        return SendLocalMessage(() => 'messages.auth.changeForgotPassword');
    }
}
