import { IDecodeToken } from '@modules/auth/domain/models';
import { AuthService, TokenService } from '@modules/auth/domain/services';
import { IAuthData } from '@modules/auth/domain/strategies/jwt.strategy';
import { User } from '@modules/user/domain/entities';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Socket } from 'socket.io';

export type SocketAuth = Socket & { user: IAuthData }

@Injectable()
export class JWTWebsocketStrategy extends PassportStrategy(Strategy, 'jwt-websocket')
{
    private readonly logger = new Logger(JWTWebsocketStrategy.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly tokenService: TokenService,
        private readonly service: AuthService
    )
    {
        super({
            secretOrKey: configService.getOrThrow('jwt.secret'),
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromExtractors([JWTWebsocketStrategy.extractJwtFromSocketClient])
        });
    }

    async validate(payload: IDecodeToken): Promise<any>
    {
        const checkBlackList = this.configService.getOrThrow<boolean>('jwt.checkBlackList');

        if (checkBlackList)
        {
            void await this.tokenService.checkTokenInBlackList(payload.id);
        }

        const user: User = await this.service.jwtAuthenticate(payload.userId);

        return { payload,  data: user };
    }

    static extractJwtFromSocketClient(socket: any): string
    {
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(socket.handshake);

        if (!token)
        {
            return null;
        }

        return token;
    }
}
