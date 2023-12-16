import { User } from '@modules/user/domain/entities';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { ILocalMessage, SendLocalMessage } from '@shared/app/utils';
import { TokenService } from '../services';

declare interface ILogoutUseCaseProps {
    decodeTokenId: string;
    decodeRefreshTokenId?: string;
    authUser: User;
}

@Injectable()
export class LogoutUseCase
{
    private readonly logger = new Logger(LogoutUseCase.name);

    constructor(
        private readonly tokenService: TokenService,
        private readonly repository: UserRepository
    )
    {}

    async handle({
        decodeTokenId,
        decodeRefreshTokenId = null,
        authUser
    }: ILogoutUseCaseProps): Promise<ILocalMessage>
    {
        await this.tokenService.setTokenBlackListed(decodeTokenId);

        if (decodeRefreshTokenId)
        {
            await this.tokenService.setTokenBlackListed(decodeRefreshTokenId);
        }

        if (authUser.onBoarding)
        {
            void (await this.repository.setFalseFirstLogin(authUser._id));
        }

        return SendLocalMessage(() => 'messages.auth.logout');
    }
}
