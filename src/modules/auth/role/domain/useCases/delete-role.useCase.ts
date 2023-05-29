import { Role } from '@modules/auth/role/domain/entities';
import { RoleRepository } from '@modules/auth/role/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';

interface Props {
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

    async handle({ id, deletePermanently = false }: Props): Promise<Role>
    {
        this.logger.log('Deleting role...');
        return this.repository.delete({ id, softDelete: !deletePermanently, withDeleted: deletePermanently });
    }
}
