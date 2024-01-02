import { FileRepository } from '@modules/common/file/infrastructure/repositories';
import { IMyStore } from '@modules/common/store';
import {  Injectable, Logger } from '@nestjs/common';
import { CriteriaBuilder } from '@shared/criteria';
import { ClsService } from 'nestjs-cls';
import { File } from '../entities';

interface IListFilesUseCaseProps {
    criteria: CriteriaBuilder;
}

@Injectable()
export class ListFilesUseCase
{
    private readonly logger = new Logger(ListFilesUseCase.name);

    constructor(
        private readonly store: ClsService<IMyStore>,
        private readonly repository: FileRepository
    )
    {}

    async handle({ criteria }: IListFilesUseCaseProps): Promise<File[]>
    {
        const paginator = await this.repository.list(criteria);

        const data = await paginator.paginate() as File [];

        this.store.set('res.pagination', await paginator.getPagination());
        this.store.set('res.metadata', paginator.getMetadata());

        return data;
    }
}
