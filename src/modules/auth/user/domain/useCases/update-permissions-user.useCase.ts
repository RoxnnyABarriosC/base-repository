import { RoleService } from '@modules/auth/role/domain/services';
import { PermissionsDto } from '@modules/auth/role/presentation/dtos';
import { User } from '@modules/auth/user/domain/entities';
import { UserRepository } from '@modules/auth/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';

interface Props {
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

    async handle({ id, dto: { permissions } }: Props): Promise<User>
    {
        void await this.roleService.validatePermissions(permissions);

        const user = await this.repository.getOne({ id });

        user.Permissions = permissions;

        return await this.repository.update(user) as User;
    }
}
