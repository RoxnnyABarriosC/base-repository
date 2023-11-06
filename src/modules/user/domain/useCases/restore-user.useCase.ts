import { User } from '@modules/user/domain/entities';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';

declare interface IRestoreUserUseCaseProps {
    id: string;
}

@Injectable()
export class RestoreUserUseCase
{
    private readonly logger = new Logger(RestoreUserUseCase.name);

    constructor(
        private readonly repository: UserRepository
    )
    {}

    async handle({ id }: IRestoreUserUseCaseProps): Promise<User>
    {
        this.logger.log('Restoring user...');

        return await this.repository.restore(id);
    }
}
