import { Token } from '@modules/auth/domain/entities';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotFoundCustomException } from '@shared/app/exceptions';
import { GetMilliseconds } from '@shared/utils';
import { Cache } from 'cache-manager';

@Injectable()
export class TokenRepository
{
    private readonly expire: number;
    private readonly expireRefresh: number;

    constructor(
        private readonly configService: ConfigService,
        @Inject(CACHE_MANAGER) public readonly cacheManager: Cache
    )
    {
        this.expire = GetMilliseconds(this.configService.getOrThrow<string>('jwt.expires'));
        this.expireRefresh = GetMilliseconds(this.configService.getOrThrow<string>('jwt.refreshExpires'));
    }

    async save(token: Token, isRefresh = false): Promise<Token>
    {
        await this.cacheManager.set(
            token._id,
            token,
            isRefresh ? this.expireRefresh : this.expire
        );
        return token;
    }

    async update(token: Token): Promise<Token>
    {
        await this.cacheManager.set(token._id, token);
        return token;
    }

    async getOne(id: string): Promise<Token>
    {
        const token = await this.cacheManager.get<Token>(id);

        if (!token)
        {
            throw new NotFoundCustomException(Token.name);
        }

        return token;
    }
}
