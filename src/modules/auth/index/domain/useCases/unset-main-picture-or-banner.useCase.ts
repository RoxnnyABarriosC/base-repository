import { User } from '@modules/auth/user/domain/entities';
import { UserRepository } from '@modules/auth/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { LocalMessageInterface } from '@shared/interfaces';
import { SendLocalMessage } from '@shared/utils';

interface Props {
    authUser: User;
    property: 'mainPicture' | 'banner';
}

@Injectable()
export class UnsetMainPictureOrBannerUseCase
{
    private readonly logger = new Logger(UnsetMainPictureOrBannerUseCase.name);

    constructor(
        private readonly repository: UserRepository
    )
    { }

    // TODO: Esta accion debe encolarse a futuro
    async handle({ authUser, property }: Props): Promise<LocalMessageInterface>
    {
        authUser[property] = null;

        void await this.repository.update(authUser);

        return SendLocalMessage(() => `messages.user.${property === 'mainPicture' ? 'unsetMainPicture' : 'unsetBanner'}`);
    }
}
