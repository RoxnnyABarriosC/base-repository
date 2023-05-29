import { RoleRepository } from '@modules/auth/role/infrastructure/repositories';
import { User } from '@modules/auth/user/domain/entities';
import { UserService } from '@modules/auth/user/domain/services';
import { UserRepository } from '@modules/auth/user/infrastructure/repositories';
import { SetRolesUserDto } from '@modules/auth/user/presentation/dtos';
import { Injectable, Logger } from '@nestjs/common';

interface Props {
    id: string;
    dto: SetRolesUserDto;
}

@Injectable()
export class SetRolesUserUseCase
{
    private readonly logger = new Logger(SetRolesUserUseCase.name);

    constructor(
        private readonly repository: UserRepository,
        private readonly roleRepository: RoleRepository,
        private readonly service: UserService
    )
    {}

    async handle({ id, dto: { rolesIds } }: Props): Promise<User>
    {
        const user = await this.repository.getOne({ id });

        void this.service.checkSuperAdmin(user);

        user.Role = await this.roleRepository.getEnableRolesByIds(user.verifyRolesIds(rolesIds));

        return await this.repository.update(user) as User;
    }
}
