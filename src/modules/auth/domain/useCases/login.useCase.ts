import { OTPService } from '@modules/securityConfig/domain/services';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '@src/modules/user/domain/entities';
import { JWTModel } from '../models/JWT.model';
import { TokenService } from '../services/token.service';

declare interface ILoginUseCaseProps {
    user: User;
}

@Injectable()
export class LoginUseCase
{
    private readonly logger = new Logger(LoginUseCase.name);

    constructor(
        private readonly tokenService: TokenService,
        private readonly otpService: OTPService
    )
    {}

    async handle({ user }: ILoginUseCaseProps): Promise<JWTModel>
    {
        return await this.tokenService.createToken(user);
    }
}
