import { FileRepository } from '@modules/common/file/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { File } from '../entities';

interface IGetFileUseCaseProps {
    id: string;
    partialRemoved: boolean;
}

@Injectable()
export class GetFileUseCase
{
    private readonly logger = new Logger(GetFileUseCase.name);

    constructor(
        private readonly repository: FileRepository
    )
    { }

    async handle({ id, partialRemoved }: IGetFileUseCaseProps): Promise<File>
    {
        return await this.repository.getOne({ id,  withDeleted: partialRemoved });
    }
}
