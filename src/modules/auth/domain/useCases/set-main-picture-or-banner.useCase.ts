import { File } from '@modules/common/file/domain/entities';
import { FileRepository } from '@modules/common/file/infrastructure/repositories';
import { STORAGE_SERVICE } from '@modules/common/storage';
import { IStorageService } from '@modules/common/storage/domain/services';
import { User } from '@modules/user/domain/entities';
import { PropertyFileEnum } from '@modules/user/domain/enums';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { MulterFile } from 'fastify-file-interceptor';

declare interface ISetMainPictureOrBannerUseCaseProps {
    rawFile: MulterFile;
    authUser: User;
    property: PropertyFileEnum;
}

@Injectable()
export class SetMainPictureOrBannerUseCase
{
    private readonly logger = new Logger(SetMainPictureOrBannerUseCase.name);

    constructor(
        private readonly repository: UserRepository,
        private readonly fileRepository: FileRepository,
        @Inject(STORAGE_SERVICE) private readonly storageService: IStorageService
    )
    { }

    // TODO: Esta accion debe encolarse a futuro
    async handle({ rawFile, property, authUser }: ISetMainPictureOrBannerUseCaseProps): Promise<File>
    {
        const file = new File(rawFile);

        file.setPath(() => `users/${authUser._id}/${property}/`);

        // Tradicionalmente todas las fotos que se suben deberia ir a una galeria privada del usuario para cuando la imagen se cambie este la pueda ver en su galeria
        void await this.repository.transaction(async(transactionManager) =>
        {
            authUser[property] = await this.fileRepository.save(file, transactionManager) as File;
            void await this.repository.update(authUser, transactionManager);
            void await this.storageService.upload(rawFile, file);
        });

        return file;
    }
}
