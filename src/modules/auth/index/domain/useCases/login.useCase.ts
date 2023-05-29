import { Injectable, Logger } from '@nestjs/common';
import { User } from '@src/modules/auth/user/domain/entities';
import { JwtModel } from '../models/JWT.model';
import { TokenService } from '../services/token.service';

interface Props {
    user: User;
}

@Injectable()
export class LoginUseCase
{
    private readonly logger = new Logger(LoginUseCase.name);

    constructor(
        private readonly tokenService: TokenService
    )
    {}

    async handle({ user }: Props): Promise<JwtModel>
    {
        return await this.tokenService.createToken(user);
    }
}
