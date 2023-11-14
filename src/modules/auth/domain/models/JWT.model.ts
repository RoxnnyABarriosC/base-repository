import { User } from '@src/modules/user/domain/entities';
import { IDecodeToken } from './decode-token.interface';

export class JWTModel
{
    private readonly expires: number;
    private readonly refreshExpires: number;

    constructor(
        private readonly user: User,
        private readonly payload:  IDecodeToken,
        private readonly refreshPayload:  IDecodeToken,
        private readonly hash: string,
        private readonly refreshHash: string
    )
    {
        this.expires = payload.exp;
        this.refreshExpires = refreshPayload.exp;
    }

    get Expires(): number
    {
        return this.expires;
    }

    get ExpiresRefresh(): number
    {
        return this.refreshExpires;
    }

    get Hash(): string
    {
        return this.hash;
    }

    get RefreshHash(): string
    {
        return this.refreshHash;
    }

    get Payload(): IDecodeToken
    {
        return this.payload;
    }

    get RefreshPayload(): IDecodeToken
    {
        return this.refreshPayload;
    }

    get User(): User
    {
        return this.user;
    }
}

