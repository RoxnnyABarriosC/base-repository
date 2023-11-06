import { FileRepository } from '@modules/common/file/infrastructure/repositories';
import { SaveFileDto } from '@modules/common/file/presentation/dtos';
import { Injectable, Logger } from '@nestjs/common';
import { MulterFile } from 'fastify-file-interceptor';
import { File } from '../entities/file.entity';
import { MinioService } from '../services/minio.service';

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
        private readonly minioService: MinioService
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
            void await this.minioService.upload(rawFile, file);
        });

        return file;
    }
}
