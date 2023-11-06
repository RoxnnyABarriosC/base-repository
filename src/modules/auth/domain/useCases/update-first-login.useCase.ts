import { User } from '@modules/user/domain/entities';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { ILocalMessage } from '@shared/interfaces';
import { SendLocalMessage } from '@shared/utils';

declare interface IUpdateFirstLoginUseCaseProps {
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

    async handle({ firstLogin, authUser }: IUpdateFirstLoginUseCaseProps): Promise<ILocalMessage>
    {
        if (authUser.firstLogin)
        {
            authUser.firstLogin = firstLogin;

            void await this.userRepository.update(authUser);
        }

        return SendLocalMessage(() => 'messages.auth.firstLoginUpdated');
    }
}
