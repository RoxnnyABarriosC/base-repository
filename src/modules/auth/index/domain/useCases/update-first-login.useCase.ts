import { User } from '@modules/auth/user/domain/entities';
import { UserRepository } from '@modules/auth/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { LocalMessageInterface } from '@shared/interfaces';
import { SendLocalMessage } from '@shared/utils';
import { I18nContext } from 'nestjs-i18n';

interface Props {
    firstLogin: boolean;
    authUser: User;
}

@Injectable()
export class UpdateFirstLoginUseCase
{
    private readonly logger = new Logger(UpdateFirstLoginUseCase.name);

    constructor(
        private readonly userRepository: UserRepository
    )
    { }

    async handle({ firstLogin, authUser }: Props): Promise<LocalMessageInterface>
    {
        if (authUser.firstLogin)
        {
            authUser.firstLogin = firstLogin;

            void await this.userRepository.update(authUser);
        }

        return SendLocalMessage(() => 'messages.auth.firstLoginUpdated');
    }
}
