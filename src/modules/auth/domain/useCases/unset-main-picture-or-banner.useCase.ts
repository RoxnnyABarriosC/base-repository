import { User } from '@modules/user/domain/entities';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { ILocalMessage, SendLocalMessage } from '@shared/app/utils';

declare interface IUnsetMainPictureOrBannerUseCaseProps {
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
    async handle({ authUser, property }: IUnsetMainPictureOrBannerUseCaseProps): Promise<ILocalMessage>
    {
        authUser[property] = null;

        void await this.repository.update(authUser);

        return SendLocalMessage(() => `messages.user.${property === 'mainPicture' ? 'unsetMainPicture' : 'unsetBanner'}`);
    }
}
