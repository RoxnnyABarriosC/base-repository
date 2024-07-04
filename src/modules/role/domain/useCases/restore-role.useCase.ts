import { RoleRepository } from '@modules/role/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { Role } from '../entities';

declare interface IRestoreRoleUseCaseProps {
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

    async handle({ id }: IRestoreRoleUseCaseProps): Promise<Role>
    {
        this.logger.log('Restoring role...');
        return await this.repository.restore({ id });
    }
}
