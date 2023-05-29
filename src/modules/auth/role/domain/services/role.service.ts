import { Role } from '@modules/auth/role/domain/entities';
import { WrongPermissionsException } from '@modules/auth/role/domain/exceptions';
import { RoleRepository } from '@modules/auth/role/infrastructure/repositories';
import { UniqueService } from '@modules/common/index/infrastructure/services';
import { Injectable, Logger } from '@nestjs/common';
import { AppPermissionsFactory } from '@src/app.permissions';
import { isEmpty } from 'class-validator';
import { intersection } from 'lodash';

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
        if (!isEmpty(permissions) && isEmpty(intersection(permissions, AppPermissionsFactory.permissions())))
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
}
