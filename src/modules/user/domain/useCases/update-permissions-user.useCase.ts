import { RoleService } from '@modules/role/domain/services';
import { PermissionsDto } from '@modules/role/presentation/dtos';
import { User } from '@modules/user/domain/entities';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';

declare interface IUpdatePermissionsUserUseCaseProps {
    id: string;
    dto: PermissionsDto
}

@Injectable()
export class UpdatePermissionsUserUseCase
{
    private readonly logger = new Logger(UpdatePermissionsUserUseCase.name);

    constructor(
        private readonly repository: UserRepository,
        private readonly roleService: RoleService
    )
    { }

    async handle({ id, dto: { permissions } }: IUpdatePermissionsUserUseCaseProps): Promise<User>
    {
        void await this.roleService.validatePermissions(permissions);

        const user = await this.repository.getOne({ id });

        user.Permissions = permissions;

        return await this.repository.update(user) as User;
    }
}
