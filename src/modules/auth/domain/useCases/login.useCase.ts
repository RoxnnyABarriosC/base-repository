import { LoginDto } from '@modules/auth/presentation/dtos/login.dto';
import { OTPPropertiesEnum } from '@modules/securityConfig/domain/enums';
import { OTPService } from '@modules/securityConfig/domain/services';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '@src/modules/user/domain/entities';
import { JWTModel } from '../models/JWT.model';
import { TokenService } from '../services/token.service';

declare interface ILoginUseCaseProps {
    user: User;
    dto: LoginDto;
    otpProperties: OTPPropertiesEnum[];
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

    async handle({ user, dto, otpProperties }: ILoginUseCaseProps): Promise<JWTModel>
    {
        await this.otpService.checkOtp(dto, otpProperties, user);
        return await this.tokenService.createToken(user);
    }
}
