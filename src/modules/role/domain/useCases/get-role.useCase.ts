import { RoleRepository } from '@modules/role/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { Role } from '../entities';

declare interface IGetRoleUseCaseProps {
    slug: string;
    partialRemoved: boolean;
}

@Injectable()
export class GetRoleUseCase
{
    private readonly logger = new Logger(GetRoleUseCase.name);

    constructor(
        private readonly repository: RoleRepository
    )
    {}

    async handle({ slug, partialRemoved }: IGetRoleUseCaseProps): Promise<Role>
    {
        this.logger.log('Get role by username...');

        const role = await this.repository.getOneBySlug({
            slug,
            withDeleted: partialRemoved,
            initThrow: true
        });

        this.logger.log('Role found successfully');

        return role;
    }
}
