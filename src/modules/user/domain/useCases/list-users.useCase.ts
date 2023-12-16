import { IMyStore } from '@modules/common/store';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import {  Injectable, Logger } from '@nestjs/common';
import { CriteriaBuilder } from '@shared/criteria';
import { ClsService } from 'nestjs-cls';
import { User } from '../entities';

declare interface IListUsersUseCaseProps {
    criteria: CriteriaBuilder;
}

@Injectable()
export class ListUsersUseCase
{
    private readonly logger = new Logger(ListUsersUseCase.name);

    constructor(
        private readonly store: ClsService<IMyStore>,
        private readonly repository: UserRepository
    )
    {}

    async handle({ criteria }: IListUsersUseCaseProps): Promise<User[]>
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
