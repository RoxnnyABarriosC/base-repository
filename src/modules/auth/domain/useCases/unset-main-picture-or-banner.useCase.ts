import { STORAGE_SERVICE } from '@modules/common/storage';
import { IStorageService } from '@modules/common/storage/domain/services';
import { User } from '@modules/user/domain/entities';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Inject, Injectable, Logger } from '@nestjs/common';
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
        private readonly repository: UserRepository,
        @Inject(STORAGE_SERVICE) private readonly storageService: IStorageService
    )
    { }

    // TODO: Esta accion debe encolarse a futuro
    async handle({ authUser, property }: IUnsetMainPictureOrBannerUseCaseProps): Promise<ILocalMessage>
    {
        const file = authUser[property];

        authUser[property] = null;

        void await this.repository.update(authUser);

        if (file)
        {
            await this.storageService.removeObject(file);
        }
        return SendLocalMessage(() => `messages.user.${property === 'mainPicture' ? 'unsetMainPicture' : 'unsetBanner'}`);
    }
}
