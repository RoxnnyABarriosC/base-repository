import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '../entities';

declare interface IGetUserUseCaseProps {
    id: string;
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

    async handle({ id, partialRemoved }: IGetUserUseCaseProps): Promise<User>
    {
        this.logger.log('Get user by username...');

        const user = await this.repository.getOne({
            id,
            withDeleted: partialRemoved
        });

        this.logger.log('User found successfully');

        return user;
    }
}
