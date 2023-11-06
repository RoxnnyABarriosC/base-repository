import { User } from '@modules/user/domain/entities';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';

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

        return await this.repository.delete({ id, softDelete: !deletePermanently, withDeleted: deletePermanently });
    }
}


