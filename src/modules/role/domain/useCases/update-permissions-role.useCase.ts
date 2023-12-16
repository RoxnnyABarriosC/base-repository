import { RoleRepository } from '@modules/role/infrastructure/repositories';
import { PermissionsDto } from '@modules/role/presentation/dtos';
import { Injectable, Logger } from '@nestjs/common';
import { ILocalMessage, SendLocalMessage } from '@shared/app/utils';
import { RoleService } from '../services';

declare interface IUpdatePermissionsRoleUseCaseProps {
    id: string;
    dto: PermissionsDto;
}

@Injectable()
export class UpdatePermissionsRoleUseCase
{
    private readonly logger = new Logger(UpdatePermissionsRoleUseCase.name);

    constructor(
        private readonly repository: RoleRepository,
        private readonly service: RoleService
    )
    {}

    async handle({ id, dto: { permissions } }: IUpdatePermissionsRoleUseCaseProps): Promise<ILocalMessage>
    {
        this.logger.log('Validating permissions...');
        void await this.service.validatePermissions(permissions);

        this.logger.log('Getting role...');
        const role = await this.repository.getOne({ id });

        this.logger.log('Updating role...');
        role.Permissions = permissions;

        void await this.repository.update(role);

        return SendLocalMessage(() => 'messages.role.permissionsUpdated');
    }
}
