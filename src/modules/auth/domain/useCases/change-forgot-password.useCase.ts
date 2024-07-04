import { ChangeForgotPasswordEvent } from '@modules/common/mail/domain/events';
import { MailEventEnum } from '@modules/common/mail/domain/listeners';
import { SecurityConfigService } from '@modules/securityConfig/domain/services';
import { UserService } from '@modules/user/domain/services';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { PasswordDto } from '@modules/user/presentation/dtos';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ILocalMessage, SendLocalMessage } from '@shared/app/utils';
import { IServerConfig } from '@src/config';
import { TokenActionEnum } from '../enums';
import { TokenService } from '../services';

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
        private readonly userService: UserService,
        private readonly securityConfigService: SecurityConfigService
    )
    { }

    async handle({ dto: { password }, confirmationToken }: IChangeForgotPasswordUseCaseProps): Promise<ILocalMessage>
    {
        const { email, action, id } = await this.tokenService.verifyToken(confirmationToken);

        const checkBlackList = this.configService.getOrThrow<boolean>('jwt.checkBlackList');

        if (checkBlackList)
        {
            void await this.tokenService.checkConfirmationTokenInBlackList(id);
        }

        void this.tokenService.validateConfirmationTokenAction(action as any, TokenActionEnum.CHANGE_FORGOT_PASSWORD);

        const user = await this.userRepository.getOneBy({
            condition: { email },
            initThrow: true
        });

        user.passwordRequestedAt = null;

        await this.securityConfigService.checkOldPassword(user, password);

        user.password = await this.userService.preparePassword(password);

        void await this.userRepository.update(user);

        await this.tokenService.setConfirmationTokenBlackListed(id, confirmationToken);

        const { url: { web } } = this.configService.get<IServerConfig>('server');

        this.eventEmitter.emit(MailEventEnum.CHANGE_FORGOT_PASSWORD, new ChangeForgotPasswordEvent(user));

        return SendLocalMessage(() => 'messages.auth.changeForgotPassword');
    }
}
