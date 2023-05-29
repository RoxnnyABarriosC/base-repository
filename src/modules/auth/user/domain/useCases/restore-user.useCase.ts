import { User } from '@modules/auth/user/domain/entities';
import { UserRepository } from '@modules/auth/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';

interface Props {
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

    async handle({ id }: Props): Promise<User>
    {
        this.logger.log('Restoring user...');

        return await this.repository.restore(id);
    }
}
