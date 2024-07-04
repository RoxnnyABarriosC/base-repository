import { OTPForgotPasswordDto } from '@modules/auth/presentation/dtos';
import { ForgotPasswordDto } from '@modules/auth/presentation/dtos/forgot-password.dto';
import { OTPTargetConfigEnum } from '@modules/securityConfig/domain/enums';
import { OTPNotFoundException } from '@modules/securityConfig/domain/exceptions';
import { OTPService, SecurityConfigService } from '@modules/securityConfig/domain/services';
import { UserService } from '@modules/user/domain/services';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { ILocalMessage, SendLocalMessage } from '@shared/app/utils';
import { isEmail } from 'class-validator';

declare interface IForgotPasswordOTPUseCaseProps {
    dto: OTPForgotPasswordDto;
}

@Injectable()
export class OTPForgotPasswordUseCase
{
    private readonly logger = new Logger(OTPForgotPasswordUseCase.name);

    constructor(
        private readonly userRepository: UserRepository,
        private readonly securityConfigService: SecurityConfigService,
        private readonly userService: UserService,
        private readonly otpService: OTPService
    )
    {}

    async handle({ dto }: IForgotPasswordOTPUseCaseProps): Promise<ILocalMessage>
    {
        const user = await this.userRepository.findOneByEmailOrPhone({
            emailOrPhone: dto.emailOrPhone,
            initThrow: true
        });

        const to = isEmail(dto.emailOrPhone) ? OTPTargetConfigEnum.EMAIL : OTPTargetConfigEnum.PHONE;

        const isValidOTP = await this.otpService.verifyOTP(to, dto.otpCode);

        if (!isValidOTP)
        {
            throw new OTPNotFoundException(to);
        }

        await this.securityConfigService.checkOldPassword(user, dto.password);

        user.password = await this.userService.preparePassword(dto.password);

        void await this.userRepository.update(user);

        return SendLocalMessage(() => 'messages.auth.changedPassword');
    }
}
