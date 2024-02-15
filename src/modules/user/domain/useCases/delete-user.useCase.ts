import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '../entities';

declare interface IDeleteUserUseCaseProps {
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

    async handle({ id, deletePermanently = false }: IDeleteUserUseCaseProps): Promise<User>
    {
        this.logger.log('Deleting user...');

        const user = await this.repository.delete({ id, softDelete: !deletePermanently, withDeleted: deletePermanently });

        if (!deletePermanently)
        {
            await this.repository.disable(id);
        }

        return user;
    }
}

