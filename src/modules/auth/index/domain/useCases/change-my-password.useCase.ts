import { AuthService } from '@modules/auth/index/domain/services';
import { ChangeMyPasswordDto } from '@modules/auth/index/presentation/dtos/change-my-password.dto';
import { User } from '@modules/auth/user/domain/entities';
import { UserService } from '@modules/auth/user/domain/services';
import { UserRepository } from '@modules/auth/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { LocalMessageInterface } from '@shared/interfaces';
import { SendLocalMessage } from '@shared/utils';
import { I18nContext } from 'nestjs-i18n';

interface Props {
    dto: ChangeMyPasswordDto,
    authUser: User
}

@Injectable()
export class ChangeMyPasswordUseCase
{
    private readonly logger = new Logger(ChangeMyPasswordUseCase.name);

    constructor(
        private readonly service: AuthService,
        private readonly userService: UserService,
        private readonly userRepository: UserRepository
    )
    { }

    async handle({ dto, authUser }: Props): Promise<LocalMessageInterface>
    {
        void await this.service.checkPassword(dto.currentPassword.toString(), authUser.password.toString());
        authUser.password = await this.userService.preparePassword(dto.password);

        void await this.userRepository.update(authUser);

        return SendLocalMessage(() => 'messages.auth.changeMyPassword');
    }
}
