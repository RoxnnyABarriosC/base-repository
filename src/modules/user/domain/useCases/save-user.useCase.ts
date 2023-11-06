import { User } from '@modules/user/domain/entities';
import { UserService } from '@modules/user/domain/services';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { SaveUserDto } from '@modules/user/presentation/dtos';
import { Injectable, Logger } from '@nestjs/common';

declare interface ISaveUserUseCaseProps {
    dto: SaveUserDto;
}

@Injectable()
export class SaveUserUseCase
{
    private readonly logger = new Logger(SaveUserUseCase.name);

    constructor(
        private readonly repository: UserRepository,
        private readonly service: UserService
    )
    {}

    async handle({ dto }: ISaveUserUseCaseProps): Promise<User>
    {
        const password = dto.password;

        delete dto.password;
        delete dto.passwordConfirmation;

        this.logger.log('creating user...');

        let user = new User(dto);

        void await this.service.validate(user);
        user.password = await this.service.preparePassword(password);

        user = await this.repository.save(user) as User;

        this.logger.log('user created successfully');

        return user;
    }
}
