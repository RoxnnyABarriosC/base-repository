import { IDecodeToken } from '@modules/auth/domain/models';
import { TokenService } from '@modules/auth/domain/services';
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ForbiddenCustomException } from '@shared/app/exceptions';
import { FastifyRequest } from 'fastify';

@Injectable()
export class RefreshTokenGuard implements CanActivate
{
    private readonly logger = new Logger(RefreshTokenGuard.name);

    constructor(
        private tokenService: TokenService,
        private readonly configService: ConfigService
    )
    { }

    async canActivate(context: ExecutionContext): Promise<boolean>
    {
        const request: FastifyRequest & { refreshToken: string, decodeRefreshToken: IDecodeToken } = context.switchToHttp().getRequest();

        if (!('refreshToken' in request.raw))
        {
            throw new ForbiddenCustomException();
        }

        const decodeRefreshToken = this.tokenService.decodeToken(request.raw['refreshToken'] as string);

        const checkBlackList = this.configService.get<boolean>('jwt.checkBlackList');

        if (checkBlackList)
        {
            void await this.tokenService.checkTokenInBlackList(decodeRefreshToken.id);
        }

        request['decodeRefreshToken'] = decodeRefreshToken;

        return true;
    }
}
