import { Role } from '@modules/auth/role/domain/entities';
import { RoleRepository } from '@modules/auth/role/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { LocalMessageInterface } from '@shared/interfaces';
import { SendLocalMessage, SlugGenerator } from '@shared/utils';
import { AppRolesFactory } from '@src/app.roles';

@Injectable()
export class SyncRolesPermissionsUseCase
{
    private readonly logger = new Logger(SyncRolesPermissionsUseCase.name);

    constructor(
        private readonly repository: RoleRepository
    )
    { }

    async handle(): Promise<LocalMessageInterface>
    {
        const appRoles = AppRolesFactory.getRoles();

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
