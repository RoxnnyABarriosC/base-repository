import { RegisterDto } from '@modules/auth/presentation/dtos';
import { ActivateAccountEvent } from '@modules/common/mail/domain/events';
import { MailEventEnum } from '@modules/common/mail/domain/listeners';
import { User } from '@modules/user/domain/entities';
import { UserService } from '@modules/user/domain/services';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ILocalMessage, SendLocalMessage } from '@shared/app/utils';
import { RmProp } from '@shared/utils';
import { IServerConfig } from '@src/config';
import { TokenActionEnum } from '../enums';
import { TokenService } from '../services';

declare interface IRegisterUseCaseProps {
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

    async handle({ dto }: IRegisterUseCaseProps): Promise<ILocalMessage>
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
        } = this.configService.get<IServerConfig>('server');

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
