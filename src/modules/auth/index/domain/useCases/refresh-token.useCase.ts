import { DecodeTokenInterface, JwtModel } from '@modules/auth/index/domain/models';
import { TokenService } from '@modules/auth/index/domain/services';
import { UserRepository } from '@modules/auth/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface Props {
    decodeRefreshToken: DecodeTokenInterface
}

@Injectable()
export class RefreshTokenUseCase
{
    private readonly logger = new Logger(RefreshTokenUseCase.name);

    constructor(
        private readonly tokenService: TokenService,
        private readonly configService: ConfigService,
        private readonly userRepository: UserRepository
    )
    { }

    async handle({ decodeRefreshToken }: Props): Promise<JwtModel>
    {
        const tokenId = decodeRefreshToken.id;
        const email = decodeRefreshToken.email;

        const user = await this.userRepository.getOneBy({
            condition: { email },
            options: { initThrow: true }
        });

        if (user.firstLogin)
        {
            void await this.userRepository.setFalseFirstLogin(user._id);
            user.firstLogin = false;
        }

        const token = await this.tokenService.getToken(tokenId);
        void await this.tokenService.setTokenBlackListed(token._id);

        return this.tokenService.createToken(user);
    }
}
