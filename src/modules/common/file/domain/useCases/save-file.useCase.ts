import { FileRepository } from '@modules/common/file/infrastructure/repositories';
import { SaveFileDto } from '@modules/common/file/presentation/dtos';
import { STORAGE_SERVICE } from '@modules/common/storage';
import { IStorageService } from '@modules/common/storage/domain/services';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { MulterFile } from 'fastify-file-interceptor';
import { File } from '../entities';

interface ISaveFileUseCaseProps {
    rawFile: MulterFile;
    dto: SaveFileDto
}

@Injectable()
export class SaveFileUseCase
{
    private readonly logger = new Logger(SaveFileUseCase.name);

    constructor(
        private readonly repository: FileRepository,
        @Inject(STORAGE_SERVICE) private readonly storageService: IStorageService
    )
    {}

    async handle({ rawFile, dto: { isPrivate } }: ISaveFileUseCaseProps): Promise<File>
    {
        let file = new File(rawFile, isPrivate);

        // lets now open a new transaction:
        // await this.repository.queryRunner.startTransaction();
        //
        // try
        // {
        //     file = await this.repository.queryRunner.manager.save(file) as File;
        //     void await this.minioService.upload(rawFile, file);
        //
        //     // commit transaction now:
        //     await this.repository.queryRunner.commitTransaction();
        // }
        // catch (error)
        // {
        //     // since we have errors let's rollback changes we made
        //     void await this.repository.queryRunner.rollbackTransaction();
        //
        //     throw error;
        // }

        void await this.repository.transaction(async(transactionManager) =>
        {
            // file = await entityManager.save(file) as File;
            file = await this.repository.save(file, transactionManager) as File;
            void await this.storageService.upload(rawFile, file);
        });

        return file;
    }
}
