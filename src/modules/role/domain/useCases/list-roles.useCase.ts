import { IMyStore } from '@modules/common/store';
import { RoleRepository } from '@modules/role/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { CriteriaBuilder } from '@shared/criteria';
import { ClsService } from 'nestjs-cls';
import { Role } from '../entities';

declare interface IListRolesUseCaseProps {
    criteria: CriteriaBuilder;
}

@Injectable()
export class ListRolesUseCase
{
    private readonly logger = new Logger(ListRolesUseCase.name);

    constructor(
        private readonly store: ClsService<IMyStore>,
        private readonly repository: RoleRepository
    )
    {}

    async handle({ criteria }: IListRolesUseCaseProps)
    {
        this.logger.log('Listing roles...');

        const paginator = await this.repository.list(criteria);

        this.logger.log('Roles listed successfully');

        const data = await paginator.paginate() as Role [];

        this.logger.log('Setting response metadata and pagination...');

        this.store.set('res.pagination', await paginator.getPagination());
        this.store.set('res.metadata', paginator.getMetadata());

        this.logger.log('Response metadata and pagination set successfully');

        return data;
    }
}
