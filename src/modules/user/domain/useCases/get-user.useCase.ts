import { User } from '@modules/user/domain/entities';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';

declare interface IGetUserUseCaseProps {
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

    async handle({ userName, partialRemoved }: IGetUserUseCaseProps): Promise<User>
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
