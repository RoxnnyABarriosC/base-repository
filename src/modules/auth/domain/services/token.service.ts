import { Token } from '@modules/auth/domain/entities';
import { TokenActionEnum } from '@modules/auth/domain/enums';
import { InvalidConfirmationTokenException } from '@modules/auth/domain/exceptions';
import { TokenBlackListedException } from '@modules/auth/domain/exceptions/token-black-listed.exception';
import { IDecodeToken, JwtModel } from '@modules/auth/domain/models';
import { TokenRepository } from '@modules/auth/infrastructure/repositories';
import { User } from '@modules/user/domain/entities';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IJwtConfig } from '@src/config';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class TokenService
{
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly tokenRepository: TokenRepository
    )
    { }

    async createToken(user: User): Promise<JwtModel>
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

        const jWTToken = new JwtModel(
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

    createConfirmationToken(email: string, action: TokenActionEnum): string
    {
        dayjs.extend(utc);
        const { iss, aud, confirmationExpires } = this.configService.get<IJwtConfig>('jwt');

        const payload = {
            iss,
            aud,
            sub: email,
            action,
            email
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

    validateConfirmationTokenAction(tokenAction: TokenActionEnum, action: TokenActionEnum): void
    {
        if (!tokenAction || tokenAction !== action)
        {
            throw new InvalidConfirmationTokenException();
        }
    }
}

