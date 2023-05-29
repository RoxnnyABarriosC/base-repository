import { File } from '@modules/common/file/domain/entities';
import { FileRepository } from '@modules/common/file/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';

interface Props {
    id: string;
}

@Injectable()
export class RestoreFileUseCase
{
    private readonly logger = new Logger(RestoreFileUseCase.name);

    constructor(
        private readonly repository: FileRepository
    )
    {}

    async handle({ id }: Props): Promise<File>
    {
        return await this.repository.restore(id);
    }
}
