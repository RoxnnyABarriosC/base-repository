import { TokenActionEnum } from '@modules/auth/index/domain/enums';
import { TokenService } from '@modules/auth/index/domain/services';
import { ForgotPasswordDto } from '@modules/auth/index/presentation/dtos/forgot-password.dto';
import { UserRepository } from '@modules/auth/user/infrastructure/repositories';
import { ForgotPasswordEvent } from '@modules/common/mail/domain/events';
import { MailEventEnum } from '@modules/common/mail/domain/listeners';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LocalMessageInterface } from '@shared/interfaces';
import { SendLocalMessage } from '@shared/utils';
import { ServerInterface } from '@src/config';
import dayjs from 'dayjs';
import { I18nContext } from 'nestjs-i18n';

interface Props {
    dto: ForgotPasswordDto;
}

@Injectable()
export class ForgotPasswordUseCase
{
    private readonly logger = new Logger(ForgotPasswordUseCase.name);

    constructor(
        private readonly tokenService: TokenService,
        private readonly userRepository: UserRepository,
        private readonly eventEmitter: EventEmitter2,
        private readonly configService: ConfigService
    )
    {}

    async handle({
        dto: { emailOrPhone }
    }: Props): Promise<LocalMessageInterface>
    {
        const user = await this.userRepository.findOneByEmailOrPhone({
            emailOrPhone,
            initThrow: true
        });

        user.passwordRequestedAt = dayjs().utc().toDate();

        void (await this.userRepository.update(user));

        const confirmationToken = this.tokenService.createConfirmationToken(
            user.email,
            TokenActionEnum.CHANGE_FORGOT_PASSWORD
        );

        const {
            url: { web }
        } = this.configService.get<ServerInterface>('server');

        const urlConfirmationToken = `${web}/auth/change-forgot-password?token=${confirmationToken}`;

        this.eventEmitter.emit(
            MailEventEnum.FORGOT_PASSWORD,
            new ForgotPasswordEvent(user, urlConfirmationToken)
        );

        return SendLocalMessage(() => 'messages.auth.forgotPassword');
    }
}
