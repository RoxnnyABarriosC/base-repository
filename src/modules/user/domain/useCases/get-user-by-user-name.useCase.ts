import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '../entities';

declare interface IGetUserByUserNameUseCaseProps {
    userName: string;
    partialRemoved: boolean;
}

@Injectable()
export class GetUserByUserNameUseCase
{
    private readonly logger = new Logger(GetUserByUserNameUseCase.name);

    constructor(
        private readonly repository: UserRepository
    )
    {}

    async handle({ userName, partialRemoved }: IGetUserByUserNameUseCaseProps): Promise<User>
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
