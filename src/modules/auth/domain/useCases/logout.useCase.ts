import { TokenService } from '@modules/auth/domain/services';
import { User } from '@modules/user/domain/entities';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { ILocalMessage } from '@shared/interfaces';
import { SendLocalMessage } from '@shared/utils';

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

        if (authUser.firstLogin)
        {
            void (await this.repository.setFalseFirstLogin(authUser._id));
        }

        return SendLocalMessage(() => 'messages.auth.logout');
    }
}
