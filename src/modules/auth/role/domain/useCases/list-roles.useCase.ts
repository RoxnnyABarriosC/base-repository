import { Role } from '@modules/auth/role/domain/entities';
import { RoleRepository } from '@modules/auth/role/infrastructure/repositories';
import { MyStore } from '@modules/common/store';
import { Injectable, Logger } from '@nestjs/common';
import { CriteriaBuilder } from '@shared/criterias';
import { ClsService } from 'nestjs-cls';

interface Props {
    criteria: CriteriaBuilder;
}

@Injectable()
export class ListRolesUseCase
{
    private readonly logger = new Logger(ListRolesUseCase.name);

    constructor(
        private readonly store: ClsService<MyStore>,
        private readonly repository: RoleRepository
    )
    {}

    async handle({ criteria }: Props)
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
