import { Role } from '@modules/auth/role/domain/entities';
import { RoleRepository } from '@modules/auth/role/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';

interface Props {
    id: string;
}

@Injectable()
export class RestoreRoleUseCase
{
    private readonly logger = new Logger(RestoreRoleUseCase.name);

    constructor(
        private readonly repository: RoleRepository
    )
    {}

    async handle({ id }: Props): Promise<Role>
    {
        this.logger.log('Restoring role...');
        return await this.repository.restore(id);
    }
}
