import { JWTModel } from '@modules/auth/domain/models';
import { OTPRegisterDto } from '@modules/auth/presentation/dtos/otp-register.dto';
import { OTPTargetConfigEnum } from '@modules/securityConfig/domain/enums';
import { OTPNotFoundException } from '@modules/securityConfig/domain/exceptions';
import { OTPService } from '@modules/securityConfig/domain/services';
import { User } from '@modules/user/domain/entities';
import { UserService } from '@modules/user/domain/services';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { RmProp } from '@shared/utils';
import { TokenService } from '../services';

declare interface IOTPRegisterUseCaseProps {
    dto: OTPRegisterDto;
}

@Injectable()
export class OTPRegisterUseCase
{
    private readonly logger = new Logger(OTPRegisterUseCase.name);

    constructor(
        private readonly tokenService: TokenService,
        private readonly repository: UserRepository,
        private readonly service: UserService,
        private readonly otpService: OTPService
    )
    {}

    async handle({ dto }: IOTPRegisterUseCaseProps): Promise<JWTModel>
    {
        const password = dto.password;
        const otpCode = dto.otpCode;

        RmProp(dto, [
            'password',
            'passwordConfirmation',
            'otpCode'
        ]);

        let user = new User({
            ...dto,
            firstName: '',
            lastName: '',
            birthday: null,
            gender: null,
            phone: null,
            enable: true
        });

        void await this.service.validate(user);

        user.password = await this.service.preparePassword(password);
        // user.permissions = initialPermissionsUsers;

        const otpValid = await this.otpService.verifyOTP(dto.email, otpCode);

        if (!otpValid)
        {
            throw new OTPNotFoundException(OTPTargetConfigEnum.EMAIL);
        }

        user = await this.repository.update(user) as User;

        return await this.tokenService.createToken(user);
    }
}
