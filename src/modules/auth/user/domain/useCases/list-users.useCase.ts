import { User } from '@modules/auth/user/domain/entities';
import { UserRepository } from '@modules/auth/user/infrastructure/repositories';
import { MyStore } from '@modules/common/store';
import {  Injectable, Logger } from '@nestjs/common';
import { CriteriaBuilder } from '@shared/criterias';
import { ClsService } from 'nestjs-cls';

interface Props {
    criteria: CriteriaBuilder;
}

@Injectable()
export class ListUsersUseCase
{
    private readonly logger = new Logger(ListUsersUseCase.name);

    constructor(
        private readonly store: ClsService<MyStore>,
        private readonly repository: UserRepository
    )
    {}

    async handle({ criteria }: Props): Promise<User[]>
    {
        this.logger.log('Listing users...');

        const paginator = await this.repository.list(criteria);

        this.logger.log('Users listed successfully');

        const data = await paginator.paginate() as User [];

        this.logger.log('Setting response metadata and pagination...');

        this.store.set('res.pagination', await paginator.getPagination());
        this.store.set('res.metadata', paginator.getMetadata());

        this.logger.log('Response metadata and pagination set successfully');

        return data;
    }
}
