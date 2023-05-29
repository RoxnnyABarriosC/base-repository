import { TokenActionEnum } from '@modules/auth/index/domain/enums';
import { TokenService } from '@modules/auth/index/domain/services';
import { ChangeMyPasswordDto } from '@modules/auth/index/presentation/dtos/change-my-password.dto';
import { UserService } from '@modules/auth/user/domain/services';
import { UserRepository } from '@modules/auth/user/infrastructure/repositories';
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
    dto: ChangeMyPasswordDto;
    confirmationToken: string;
}

@Injectable()
export class ResetPasswordWithTokenUseCase
{
    private readonly logger = new Logger(ResetPasswordWithTokenUseCase.name);

    constructor(
        private readonly userService: UserService,
        private readonly userRepository: UserRepository,
        private readonly tokenService: TokenService,
        private readonly configService: ConfigService,
        private readonly eventEmitter: EventEmitter2
    )
    { }

    async handle({ dto, confirmationToken }: Props): Promise<LocalMessageInterface>
    {
        const { email, action } = await this.tokenService.verifyToken(confirmationToken);

        void this.tokenService.validateConfirmationTokenAction(action as any, TokenActionEnum.RESET_PASSWORD);

        const user = await this.userRepository.getOneBy({
            condition: { email },
            options: { initThrow: true }
        });

        user.password = await this.userService.preparePassword(dto.password);

        void await this.userRepository.update(user);

        const { url: { web } } = this.configService.get<ServerInterface>('server');

        this.eventEmitter.emit(MailEventEnum.CHANGE_FORGOT_PASSWORD, new ChangeForgotPasswordEvent(user));

        return SendLocalMessage(() => 'messages.auth.resetPassword');
    }
}
