import { RoleRepository } from '@modules/role/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { Role } from '../entities';

declare interface IDeleteRoleUseCaseProps {
    id: string;
    deletePermanently?: boolean;
}

@Injectable()
export class DeleteRoleUseCase
{
    private readonly logger = new Logger(DeleteRoleUseCase.name);

    constructor(
        private readonly repository: RoleRepository
    )
    {}

    async handle({ id, deletePermanently = false }: IDeleteRoleUseCaseProps): Promise<Role>
    {
        this.logger.log('Deleting role...');
        return this.repository.delete({ id, softDelete: !deletePermanently, withDeleted: deletePermanently });
    }
}
