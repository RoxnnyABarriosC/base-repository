import { UniqueService } from '@modules/common/index/infrastructure/services';
import { RoleRepository } from '@modules/role/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { AllAppPermissions } from '@src/app.permissions';
import { isEmpty } from 'class-validator';
import { intersection } from 'lodash';
import { Role } from '../entities';
import { NotAllowedRemoveASystemRolException, SystemRolCanNotBeModifiedException, WrongPermissionsException } from '../exceptions';

@Injectable()
export class RoleService
{
    private readonly logger = new Logger(RoleService.name);

    constructor(
        private readonly uniqueService: UniqueService,
        private readonly repository: RoleRepository
    )
    { }

    async validate(entity: Role): Promise<void>
    {
        void await this.uniqueService.validate<Role>({
            repository: RoleRepository,
            validate: {
                only: {
                    name: entity.name,
                    slug: entity.slug
                }
            },
            refValue: entity._id
        });
    }

    async validatePermissions(permissions: string[]): Promise<void>
    {
        if (!isEmpty(permissions) && isEmpty(intersection(permissions, AllAppPermissions.permissions())))
        {
            throw new WrongPermissionsException();
        }
    }

    async validateAllowedViews(allowedViews: string[]): Promise<void>
    {
        // TODO: definir las vistas permitidas
        // if (!isEmpty(allowedViews) && isEmpty(intersection(allowedViews, [])))
        // {
        //     throw new WrongViewsException();
        // }
    }

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
