import { RoleRepository } from '@modules/role/infrastructure/repositories';
import { UpdateRoleDto } from '@modules/role/presentation/dtos';
import { Injectable, Logger } from '@nestjs/common';
import { Role } from '../entities';
import { RoleService } from '../services';

declare interface IUpdateRoleUseCaseProps {
    id: string;
    dto: UpdateRoleDto;
}

@Injectable()
export class UpdateRoleUseCase
{
    private readonly logger = new Logger(UpdateRoleUseCase.name);

    constructor(
        private readonly repository: RoleRepository,
        private readonly service: RoleService
    )
    {}

    async handle({ id, dto }: IUpdateRoleUseCaseProps): Promise<Role>
    {
        this.logger.log('Getting role...');
        const role = await this.repository.getOne({ id });

        role.build(dto);

        role.Slug = dto.name;

        this.logger.log('Validating role...');
        void await this.service.validate(role);

        this.logger.log('Updating role...');

        return await this.repository.update(role) as Role;
    }
}
