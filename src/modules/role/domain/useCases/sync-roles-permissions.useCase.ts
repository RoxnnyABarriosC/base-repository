import { RoleRepository } from '@modules/role/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { ILocalMessage, SendLocalMessage } from '@shared/app/utils';
import { SlugGenerator } from '@shared/utils';
import { AllAppRoles } from '@src/app.roles';
import { Role } from '../entities';

@Injectable()
export class SyncRolesPermissionsUseCase
{
    private readonly logger = new Logger(SyncRolesPermissionsUseCase.name);

    constructor(
        private readonly repository: RoleRepository
    )
    { }

    async handle(): Promise<ILocalMessage>
    {
        const appRoles = AllAppRoles.getRoles();

        void await Promise.all(appRoles.map(async(appRole) =>
        {
            const role = await this.repository.getOneBySlug({
                slug: SlugGenerator(appRole.Name),
                initThrow: false
            });

            if (role)
            {
                role.permissions = appRole.Get();
                role.ofSystem = true;
                role.enable = true;
                return this.repository.update(role);
            }

            const newRole = new Role({
                name: appRole.Name,
                permissions: appRole.Get(),
                enable: true,
                ofSystem: true
            });

            newRole.Slug = appRole.Name;

            return this.repository.save(newRole);
        }));

        return SendLocalMessage(() => 'messages.role.syncPermissions');
    }
}
