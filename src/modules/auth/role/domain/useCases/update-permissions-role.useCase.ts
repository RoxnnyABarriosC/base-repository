import { RoleService } from '@modules/auth/role/domain/services';
import { RoleRepository } from '@modules/auth/role/infrastructure/repositories';
import { PermissionsDto } from '@modules/auth/role/presentation/dtos';
import { Injectable, Logger } from '@nestjs/common';
import { LocalMessageInterface } from '@shared/interfaces';
import { SendLocalMessage } from '@shared/utils';

interface Props {
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

    async handle({ id, dto: { permissions } }: Props): Promise<LocalMessageInterface>
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
