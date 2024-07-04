import { User } from '@modules/user/domain/entities';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IDecodeToken } from '../models';
import { AuthService, TokenService } from '../services';

export declare interface IAuthData {
    payload: IDecodeToken;
    data: User;
}

export type RequestAuth = FastifyRequest & { user: IAuthData }

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy)
{
    private readonly logger = new Logger(JWTStrategy.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly tokenService: TokenService,
        private readonly service: AuthService
    )
    {
        super({
            secretOrKey: configService.getOrThrow('jwt.secret'),
            ignoreExpiration: true,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            passReqToCallback: true
        });
    }

    async validate(req: FastifyRequest, payload: IDecodeToken): Promise<IAuthData>
    {
        const checkBlackList = this.configService.getOrThrow<boolean>('jwt.checkBlackList');

        const token = req.raw.headers.authorization.split(' ')[1];

        await this.tokenService.checkExpire(token);

        if (checkBlackList)
        {
            void await this.tokenService.checkTokenInBlackList(payload.id);
        }

        const user: User = await this.service.jwtAuthenticate(payload.userId);

        return { payload,  data: user };
    }
}
