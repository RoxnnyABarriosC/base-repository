import { ExpiredTokenException } from '@modules/auth/domain/exceptions/expired-token.exception';
import { TokenRepository } from '@modules/auth/infrastructure/repositories';
import { User } from '@modules/user/domain/entities';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { ForbiddenCustomException } from '@shared/app/exceptions';
import { GetMilliseconds } from '@shared/utils';
import { IJwtConfig } from '@src/config';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { v4 as uuidV4 } from 'uuid';
import { Token } from '../entities';
import { TokenActionEnum } from '../enums';
import { InvalidConfirmationTokenException, TokenBlackListedException } from '../exceptions';
import { IDecodeToken, JWTModel } from '../models';

@Injectable()
export class TokenService
{
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly tokenRepository: TokenRepository
    )
    { }

    async createToken(user: User): Promise<JWTModel>
    {
        const { iss, aud, refreshExpires } = this.configService.get<IJwtConfig>('jwt');

        const basePayload: IDecodeToken = {
            iss,
            aud,
            sub: user.email,
            userId: user._id,
            email: user.email
        };

        const hash = this.jwtService.sign({ id: uuidV4(), ...basePayload });
        const refreshHash = this.jwtService.sign({ id: uuidV4(), ...basePayload }, { expiresIn: refreshExpires });

        const jWTToken = new JWTModel(
            user,
            this.jwtService.decode(hash) as IDecodeToken,
            this.jwtService.decode(refreshHash) as IDecodeToken,
            hash,
            refreshHash);

        const token = new Token({
            _id: jWTToken.Payload.id,
            hash: {
                value: jWTToken.Hash,
                payload: jWTToken.Payload,
                expires: jWTToken.Expires,
                blackListed: false
            }
        });

        const refreshToken = new Token({
            _id: jWTToken.RefreshPayload.id,
            hash: {
                value: jWTToken.RefreshHash,
                payload: jWTToken.RefreshPayload,
                expires: jWTToken.ExpiresRefresh,
                blackListed: false
            }
        });

        void await Promise.all([
            await this.tokenRepository.save(token),
            await this.tokenRepository.save(refreshToken, true)
        ]);

        return jWTToken;
    }

    async setTokenBlackListed(id: string): Promise<void>
    {
        const token = await this.tokenRepository.getOne(id);

        token.hash.blackListed = true;

        await this.tokenRepository.save(token);
    }

    async setConfirmationTokenBlackListed(id: string, confirmationToken: string): Promise<void>
    {
        await this.tokenRepository.cacheManager.set(id,  confirmationToken, GetMilliseconds(this.configService.getOrThrow<string>('jwt.confirmationExpires')));
    }

    decodeToken(token: string): IDecodeToken
    {
        return this.jwtService.decode(token) as IDecodeToken;
    }

    async getToken(id: string): Promise<Token>
    {
        return await this.tokenRepository.getOne(id);
    }

    async checkTokenInBlackList(id: string)
    {
        const token = await this.tokenRepository.getOne(id);

        if (token.hash.blackListed)
        {
            throw new TokenBlackListedException();
        }
    }

    async checkConfirmationTokenInBlackList(id: string)
    {
        const token = await this.tokenRepository.cacheManager.get(id);

        if (token)
        {
            throw new TokenBlackListedException();
        }
    }

    createConfirmationToken(email: string, action: TokenActionEnum): string
    {
        dayjs.extend(utc);
        const { iss, aud, confirmationExpires } = this.configService.get<IJwtConfig>('jwt');

        const payload = {
            iss,
            aud,
            sub: email,
            action,
            email,
            id: uuidV4()
        };

        return this.jwtService.sign(payload, { expiresIn: confirmationExpires });
    }

    async verifyToken(token: string): Promise<IDecodeToken>
    {
        try
        {
            return await this.jwtService.verifyAsync(token);
        }
        catch (e)
        {
            throw new InvalidConfirmationTokenException();
        }
    }

    async checkExpire(token: string): Promise<IDecodeToken>
    {
        try
        {
            return await this.jwtService.verifyAsync(token);
        }
        catch (e)
        {
            if (!(e instanceof TokenExpiredError))
            {
                throw new ForbiddenCustomException();
            }

            throw new ExpiredTokenException();
        }
    }

    validateConfirmationTokenAction(tokenAction: TokenActionEnum, action: TokenActionEnum): void
    {
        if (!tokenAction || tokenAction !== action)
        {
            throw new InvalidConfirmationTokenException();
        }
    }
}

