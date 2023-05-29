import { TokenActionEnum } from '@modules/auth/index/domain/enums';
import { TokenService } from '@modules/auth/index/domain/services';
import { RegisterDto } from '@modules/auth/index/presentation/dtos/register.dto';
import { User } from '@modules/auth/user/domain/entities';
import { UserService } from '@modules/auth/user/domain/services';
import { UserRepository } from '@modules/auth/user/infrastructure/repositories';
import { ActivateAccountEvent } from '@modules/common/mail/domain/events';
import { MailEventEnum } from '@modules/common/mail/domain/listeners';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LocalMessageInterface } from '@shared/interfaces';
import { RmProp, SendLocalMessage } from '@shared/utils';
import { ServerInterface } from '@src/config';
import { I18nContext } from 'nestjs-i18n';

interface Props {
    dto: RegisterDto;
}

@Injectable()
export class RegisterUseCase
{
    private readonly logger = new Logger(RegisterUseCase.name);

    constructor(
        private readonly tokenService: TokenService,
        private readonly repository: UserRepository,
        private readonly service: UserService,
        private readonly configService: ConfigService,
        private readonly eventEmitter: EventEmitter2
    )
    {}

    async handle({ dto }: Props): Promise<LocalMessageInterface>
    {
        const password = dto.password;

        RmProp(dto, [
            'password',
            'passwordConfirmation'
        ]);

        const user = new User(dto);

        void await this.service.validate(user);

        user.password = await this.service.preparePassword(password);
        // user.permissions = initialPermissionsUsers;

        void await this.repository.update(user);

        const confirmationToken = this.tokenService.createConfirmationToken(
            user.email,
            TokenActionEnum.ACTIVATE_ACCOUNT
        );

        const {
            url: { web }
        } = this.configService.get<ServerInterface>('server');

        this.eventEmitter.emit(
            MailEventEnum.ACTIVATE_ACCOUNT,
            new ActivateAccountEvent(
                user,
                `${web}/activate-your-account?token=${confirmationToken}`
            )
        );

        return SendLocalMessage(() => 'messages.auth.register');
    }
}
