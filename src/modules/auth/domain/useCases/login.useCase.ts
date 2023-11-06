import { LoginDto } from '@modules/auth/presentation/dtos/login.dto';
import { OtpPropertiesEnum } from '@modules/otp/domain/enums';
import { OTPService } from '@modules/otp/domain/services';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '@src/modules/user/domain/entities';
import { JwtModel } from '../models/JWT.model';
import { TokenService } from '../services/token.service';

declare interface ILoginUseCaseProps {
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

    async handle({ user, dto, otpProperties }: ILoginUseCaseProps): Promise<JwtModel>
    {
        await this.otpService.checkOtp(dto, otpProperties, user);
        return await this.tokenService.createToken(user);
    }
}
