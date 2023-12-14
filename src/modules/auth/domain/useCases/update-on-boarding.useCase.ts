import { User } from '@modules/user/domain/entities';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { ILocalMessage } from '@shared/interfaces';
import { SendLocalMessage } from '@shared/utils';

declare interface IUpdateOnBoardingUseCaseProps {
    onBoarding: boolean;
    authUser: User;
}

@Injectable()
export class UpdateOnBoardingUseCase
{
    private readonly logger = new Logger(UpdateOnBoardingUseCase.name);

    constructor(
        private readonly userRepository: UserRepository
    )
    { }

    async handle({ onBoarding, authUser }: IUpdateOnBoardingUseCaseProps): Promise<ILocalMessage>
    {
        if (authUser.onBoarding)
        {
            authUser.onBoarding = onBoarding;

            void await this.userRepository.update(authUser);
        }

        return SendLocalMessage(() => 'messages.auth.onBoardingUpdated');
    }
}
