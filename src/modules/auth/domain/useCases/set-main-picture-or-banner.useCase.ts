import { File } from '@modules/common/file/domain/entities';
import { BlobService } from '@modules/common/file/domain/services/azure';
import { FileRepository } from '@modules/common/file/infrastructure/repositories';
import { User } from '@modules/user/domain/entities';
import { PropertyFileEnum } from '@modules/user/domain/enums';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
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
        private readonly minioService: BlobService
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
            void await this.minioService.upload(rawFile, file);
        });

        return file;
    }
}
