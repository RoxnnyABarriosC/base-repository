import { User } from '@src/modules/auth/user/domain/entities';
import { DecodeTokenInterface } from './decode-token.interface';

export class JwtModel
{
    private readonly user: User;
    private readonly hash: string;
    private readonly refreshHash: string;
    private readonly payload: DecodeTokenInterface;
    private readonly refreshPayload: DecodeTokenInterface;
    private readonly expires: number;
    private readonly refreshExpires: number;

    constructor(
        user: User,
        payload:  DecodeTokenInterface,
        refreshPayload:  DecodeTokenInterface,
        hash: string,
        refreshHash: string
    )
    {
        this.user = user;
        this.payload = payload;
        this.refreshPayload = refreshPayload;
        this.hash = hash;
        this.refreshHash = refreshHash;
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

    get Payload(): DecodeTokenInterface
    {
        return this.payload;
    }

    get RefreshPayload(): DecodeTokenInterface
    {
        return this.refreshPayload;
    }

    get User(): User
    {
        return this.user;
    }
}

