import { DecodeTokenInterface } from '@modules/auth/index/domain/models';
import { TokenService } from '@modules/auth/index/domain/services';
import { User } from '@modules/auth/user/domain/entities';
import { UserRepository } from '@modules/auth/user/infrastructure/repositories';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenCustomException } from '@shared/exceptions';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface AuthDataInterface {
    payload: DecodeTokenInterface;
    data: User;
}

export type RequestAuth = Request & { user: AuthDataInterface }

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy)
{
    private readonly logger = new Logger(JwtStrategy.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly tokenService: TokenService,
        private readonly userRepository: UserRepository
    )
    {
        super({
            secretOrKey: configService.getOrThrow('jwt.secret'),
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate(payload: DecodeTokenInterface): Promise<AuthDataInterface>
    {
        const checkBlackList = this.configService.getOrThrow<boolean>('jwt.checkBlackList');

        if (checkBlackList)
        {
            void await this.tokenService.checkTokenInBlackList(payload.id);
        }

        const user: User = await this.userRepository.getOneBy({
            condition: { _id: payload.userId },
            options: { initThrow: false },
            withDeleted: false
        });

        if (!user)
        {
            throw new ForbiddenCustomException();
        }

        return { payload,  data: user };
    }
}
