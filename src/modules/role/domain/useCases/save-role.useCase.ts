import { RoleRepository } from '@modules/role/infrastructure/repositories';
import { SaveRoleDto } from '@modules/role/presentation/dtos';
import { Injectable, Logger } from '@nestjs/common';
import { Role } from '../entities';
import { RoleService } from '../services';

declare interface ISaveRoleUseCaseProps {
    dto: SaveRoleDto;
}

@Injectable()
export class SaveRoleUseCase
{
    private readonly logger = new Logger(SaveRoleUseCase.name);

    constructor(
        private readonly repository: RoleRepository,
        private readonly service: RoleService
    )
    {}

    async handle({ dto }: ISaveRoleUseCaseProps): Promise<Role>
    {
        this.logger.log('creating role...');

        await this.service.validatePermissions(dto.permissions);

        let role = new Role(dto);

        role.Slug = dto.name;

        void await this.service.validate(role);

        role = await this.repository.save(role) as Role;

        this.logger.log('role created successfully');

        return role;
    }
}
