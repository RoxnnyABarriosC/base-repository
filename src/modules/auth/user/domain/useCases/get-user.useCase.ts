import { User } from '@modules/auth/user/domain/entities';
import { UserRepository } from '@modules/auth/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';

interface Props {
    userName: string;
    partialRemoved: boolean;
}

@Injectable()
export class GetUserUseCase
{
    private readonly logger = new Logger(GetUserUseCase.name);

    constructor(
        private readonly repository: UserRepository
    )
    {}

    async handle({ userName, partialRemoved }: Props): Promise<User>
    {
        this.logger.log('Get user by username...');

        const user = await this.repository.getOneByUserName({
            userName,
            withDeleted: partialRemoved,
            initThrow: true
        });

        this.logger.log('User found successfully');

        return user;
    }
}
