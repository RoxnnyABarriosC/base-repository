import { FileRepository } from '@modules/common/file/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { File } from '../entities';

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
        return await this.repository.restore({ id });
    }
}
