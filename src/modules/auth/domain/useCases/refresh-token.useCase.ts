import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { IDecodeToken, JWTModel } from '../models';
import { TokenService } from '../services';

declare interface IRefreshTokenUseCaseProps {
    decodeRefreshToken: IDecodeToken
}

@Injectable()
export class RefreshTokenUseCase
{
    private readonly logger = new Logger(RefreshTokenUseCase.name);

    constructor(
        private readonly tokenService: TokenService,
        private readonly userRepository: UserRepository
    )
    { }

    async handle({ decodeRefreshToken }: IRefreshTokenUseCaseProps): Promise<JWTModel>
    {
        const tokenId = decodeRefreshToken.id;
        const email = decodeRefreshToken.email;

        const user = await this.userRepository.getOneBy({
            condition: { email },
            initThrow: true
        });

        if (user.onBoarding)
        {
            void await this.userRepository.setFalseFirstLogin(user._id);
            user.onBoarding = false;
        }

        const token = await this.tokenService.getToken(tokenId);
        void await this.tokenService.setTokenBlackListed(token._id);

        return this.tokenService.createToken(user);
    }
}
