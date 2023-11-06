import { TokenActionEnum } from '@modules/auth/domain/enums';
import { TokenService } from '@modules/auth/domain/services';
import { ChangeMyPasswordDto } from '@modules/auth/presentation/dtos/change-my-password.dto';
import { ChangeForgotPasswordEvent } from '@modules/common/mail/domain/events';
import { MailEventEnum } from '@modules/common/mail/domain/listeners';
import { UserService } from '@modules/user/domain/services';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ILocalMessage } from '@shared/interfaces';
import { SendLocalMessage } from '@shared/utils';
import { IServerConfig } from '@src/config';

declare interface IResetPasswordWithTokenUseCaseProps {
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

    async handle({ dto, confirmationToken }: IResetPasswordWithTokenUseCaseProps): Promise<ILocalMessage>
    {
        const { email, action } = await this.tokenService.verifyToken(confirmationToken);

        void this.tokenService.validateConfirmationTokenAction(action as any, TokenActionEnum.RESET_PASSWORD);

        const user = await this.userRepository.getOneBy({
            condition: { email },
            options: { initThrow: true }
        });

        user.password = await this.userService.preparePassword(dto.password);

        void await this.userRepository.update(user);

        const { url: { web } } = this.configService.get<IServerConfig>('server');

        this.eventEmitter.emit(MailEventEnum.CHANGE_FORGOT_PASSWORD, new ChangeForgotPasswordEvent(user));

        return SendLocalMessage(() => 'messages.auth.resetPassword');
    }
}
