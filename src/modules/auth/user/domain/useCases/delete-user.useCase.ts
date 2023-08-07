import { User } from '@modules/auth/user/domain/entities';
import { UserRepository } from '@modules/auth/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';

interface Props {
    id: string;
    deletePermanently?: boolean;
}

@Injectable()
export class DeleteUserUseCase
{
    private readonly logger = new Logger(DeleteUserUseCase.name);

    constructor(
        private readonly repository: UserRepository
    )
    {}

    async handle({ id, deletePermanently = false }: Props): Promise<User>
    {
        this.logger.log('Deleting user...');

        return await this.repository.delete({ id, softDelete: !deletePermanently, withDeleted: deletePermanently });
    }
}


