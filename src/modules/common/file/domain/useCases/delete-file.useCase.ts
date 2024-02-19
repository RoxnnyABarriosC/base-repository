import { FileRepository } from '@modules/common/file/infrastructure/repositories';
import { STORAGE_SERVICE } from '@modules/common/storage';
import { IStorageService } from '@modules/common/storage/domain/services';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { File } from '../entities';
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
        @Inject(STORAGE_SERVICE) private readonly storageService: IStorageService
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
                await this.storageService.removeObject(file);
            }
        });

        return file;
    }
}
