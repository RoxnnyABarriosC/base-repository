import { RoleRepository } from '@modules/role/infrastructure/repositories';
import { User } from '@modules/user/domain/entities';
import { UserService } from '@modules/user/domain/services';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { SetRolesUserDto } from '@modules/user/presentation/dtos';
import { Injectable, Logger } from '@nestjs/common';

declare interface ISetRolesUserUseCaseProps {
    id: string;
    dto: SetRolesUserDto;
}

@Injectable()
export class SetRolesUserUseCase
{
    private readonly logger = new Logger(SetRolesUserUseCase.name);

    constructor(
        private readonly repository: UserRepository,
        private readonly roleRepository: RoleRepository
    )
    {}

    async handle({ id, dto: { rolesIds } }: ISetRolesUserUseCaseProps): Promise<User>
    {
        const user = await this.repository.getOne({ id });

        user.Role = await this.roleRepository.getEnableRolesByIds(user.verifyRolesIds(rolesIds));

        return await this.repository.update(user) as User;
    }
}
