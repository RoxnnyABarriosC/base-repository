import { RoleRepository } from '@modules/role/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { Role } from '../entities';
import { NotAllowedRemoveASystemRolException, SystemRolCanNotBeModifiedException } from '../exceptions';

@Injectable()
export class RolePolicyService
{
    private readonly logger = new Logger(RolePolicyService.name);

    constructor(
        private readonly repository: RoleRepository
    )
    { }

    async checkSystemRolPolicy(id: string, withDeleted = false): Promise<void>
    {
        const role = await this.repository.exist({ condition: { _id: id }, initThrow: true, select: ['ofSystem', '_id'], withDeleted }) as Role;

        if (role.ofSystem)
        {
            throw new SystemRolCanNotBeModifiedException();
        }
    }

    async checkNotAllowedRemoveASystemRolPolicy(id: string, withDeleted = false): Promise<void>
    {
        const role = await this.repository.exist({ condition: { _id: id }, initThrow: true, select: ['ofSystem', '_id'], withDeleted }) as Role;

        if (role.ofSystem)
        {
            throw new NotAllowedRemoveASystemRolException();
        }
    }
}
