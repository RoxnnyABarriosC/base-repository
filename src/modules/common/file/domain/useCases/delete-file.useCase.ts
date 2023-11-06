import { File } from '@modules/common/file/domain/entities';
import { MinioService } from '@modules/common/file/domain/services';
import { FileRepository } from '@modules/common/file/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';

interface IDeleteFileUseCaseProps {
    id: string;
    deletePermanently: boolean;
}

@Injectable()
export class DeleteFileUseCase
{
    private readonly logger = new Logger(DeleteFileUseCase.name);

    constructor(
        private readonly repository: FileRepository,
        private readonly minioService: MinioService
    )
    { }

    async handle({ id, deletePermanently }: IDeleteFileUseCaseProps): Promise<File>
    {
        let file: File;

        await this.repository.transaction(async(transactionManager) =>
        {
            file = await this.repository.delete({ id, softDelete: !deletePermanently, withDeleted: deletePermanently }, transactionManager);

            if (deletePermanently && file)
            {
                await this.minioService.removeObject(file);
            }
        });

        return file;
    }
}
