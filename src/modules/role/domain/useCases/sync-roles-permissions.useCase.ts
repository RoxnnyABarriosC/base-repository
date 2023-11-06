import { Role } from '@modules/role/domain/entities';
import { RoleRepository } from '@modules/role/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { ILocalMessage } from '@shared/interfaces';
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

    async handle(): Promise<ILocalMessage>
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
