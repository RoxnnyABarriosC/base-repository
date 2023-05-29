import { TokenService } from '@modules/auth/index/domain/services';
import { User } from '@modules/auth/user/domain/entities';
import { UserRepository } from '@modules/auth/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { LocalMessageInterface } from '@shared/interfaces';
import { SendLocalMessage } from '@shared/utils';
import { I18nContext } from 'nestjs-i18n';

interface Props {
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
    }: Props): Promise<LocalMessageInterface>
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
