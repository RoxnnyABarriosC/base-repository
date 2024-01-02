import { UserRepository } from '@modules/user/infrastructure/repositories';
import { SaveUserDto } from '@modules/user/presentation/dtos';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { passwordGeneratorRegex } from '@shared/regex';
import { generateRandomNumber } from '@shared/utils';
import { ILengthConfig } from '@src/config';
import passwordGenerator from 'password-generator';
import { User } from '../entities';
import { UserService } from '../services';

declare interface ISaveUserUseCaseProps {
    dto: SaveUserDto;
}

@Injectable()
export class SaveUserUseCase
{
    private readonly logger = new Logger(SaveUserUseCase.name);

    constructor(
        private readonly repository: UserRepository,
        private readonly service: UserService,
        private readonly configService: ConfigService
    )
    {}

    async handle({ dto }: ISaveUserUseCaseProps): Promise<User>
    {
        this.logger.log('creating user...');

        const { min, max } = this.configService.getOrThrow<ILengthConfig>('validatorProperties.password');

        const passwordLength = generateRandomNumber(min, max);

        const password =  passwordGenerator(passwordLength, false, passwordGeneratorRegex);

        let user = new User(dto);

        void await this.service.validate(user);
        user.password = await this.service.preparePassword(password);

        user = await this.repository.save(user) as User;

        this.logger.log('user created successfully');

        return user;
    }
}
