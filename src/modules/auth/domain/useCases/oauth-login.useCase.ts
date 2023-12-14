import { OAuthAccountPropertiesDictionary } from '@modules/auth/domain/dictionaries';
import { OAuthProviderEnum } from '@modules/auth/domain/enums';
import { AuthService } from '@modules/auth/domain/services';
import { RegisterDto } from '@modules/auth/presentation/dtos';
import { User } from '@modules/user/domain/entities';
import { UserService } from '@modules/user/domain/services';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { passwordGeneratorRegex } from '@shared/regex';
import { generateRandomNumber } from '@shared/utils';
import { ILengthConfig } from '@src/config';
import passwordGenerator from 'password-generator';
import { JWTModel } from '../models/JWT.model';
import { TokenService } from '../services/token.service';

declare interface IOAuthLoginUseCaseProps {
    dto: Partial<RegisterDto>;
    provider: OAuthProviderEnum;
    accountId: string
}

@Injectable()
export class OAuthLoginUseCase
{
    private readonly logger = new Logger(OAuthLoginUseCase.name);

    constructor(
        private readonly tokenService: TokenService,
        private readonly userRepository: UserRepository,
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly configService: ConfigService
    )
    {}

    async handle({ dto, provider, accountId }: IOAuthLoginUseCaseProps): Promise<JWTModel>
    {
        let user = await this.authService.getOauthUser(provider, accountId);

        if (!user)
        {
            const { min, max } = this.configService.getOrThrow<ILengthConfig>('validatorProperties.password');

            const passwordLength = generateRandomNumber(min, max);

            const password =  passwordGenerator(passwordLength, false, passwordGeneratorRegex);

            user = new User(dto);

            user.enable = true;

            await this.userService.validate(user);

            user.password = await this.userService.preparePassword(password);

            user[OAuthAccountPropertiesDictionary.get(provider)] = accountId;

            user = await this.userRepository.save(user) as User;
        }

        return await this.tokenService.createToken(user);
    }
}
