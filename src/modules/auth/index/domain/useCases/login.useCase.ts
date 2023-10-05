import { LoginDto } from '@modules/auth/index/presentation/dtos/login.dto';
import { OtpPropertiesEnum } from '@modules/auth/otp/domain/enums';
import { OTPService } from '@modules/auth/otp/domain/services';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '@src/modules/auth/user/domain/entities';
import { JwtModel } from '../models/JWT.model';
import { TokenService } from '../services/token.service';

interface Props {
    user: User;
    dto: LoginDto;
    otpProperties: OtpPropertiesEnum[];
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

    async handle({ user, dto, otpProperties }: Props): Promise<JwtModel>
    {
        await this.otpService.checkOtp(dto, otpProperties, user);
        return await this.tokenService.createToken(user);
    }
}
