import { FileRepository } from '@modules/common/file/infrastructure/repositories';
import { SaveFileDto } from '@modules/common/file/presentation/dtos';
import { STORAGE_SERVICE } from '@modules/common/storage';
import { IStorageService } from '@modules/common/storage/domain/services';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Settle } from '@shared/utils';
import { MulterFile } from 'fastify-file-interceptor';
import { File } from '../entities/file.entity';

interface ISaveFilesUseCaseProps {
    rawFiles: MulterFile[];
    dto: SaveFileDto
}


@Injectable()
export class SaveFilesUseCase
{
    private readonly logger = new Logger(SaveFilesUseCase.name);

    constructor(
        private readonly repository: FileRepository,
        @Inject(STORAGE_SERVICE) private readonly storageService: IStorageService
    )
    {}

    async handle({ rawFiles, dto: { isPrivate } }: ISaveFilesUseCaseProps): Promise<File[]>
    {
        const files: File[] = [];

        void await this.repository.transaction(async(transactionManager) =>
        {
            try
            {
                void await Settle(rawFiles.map(async(rawFile) =>
                {
                    const filePromise = async() =>
                    {
                        const file = new File(rawFile, isPrivate);

                        files.push(await this.repository.save(file, transactionManager) as File);

                        void await this.storageService.upload(rawFile, file);
                    };

                    return filePromise();
                }));
            }
            catch (e)
            {
                await this.storageService.removeObjects(files);
                throw e;
            }
        });

        return files;
    }
}
