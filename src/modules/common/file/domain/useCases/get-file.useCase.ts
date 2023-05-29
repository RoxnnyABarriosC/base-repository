import { File } from '@modules/common/file/domain/entities';
import { FileRepository } from '@modules/common/file/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';

interface Props {
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

    async handle({ id, partialRemoved }: Props): Promise<File>
    {
        return await this.repository.getOne({ id,  withDeleted: partialRemoved });
    }
}
