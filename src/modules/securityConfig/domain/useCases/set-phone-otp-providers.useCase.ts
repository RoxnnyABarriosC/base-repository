import { OTPTargetConfigEnum } from '@modules/securityConfig/domain/enums';
import { OTPDisabledException } from '@modules/securityConfig/domain/exceptions';
import { SecurityConfigRepository } from '@modules/securityConfig/infrastructure/repositories';
import { SetProvidersDto } from '@modules/securityConfig/presentation/dtos';
import { Injectable, Logger } from '@nestjs/common';
import {  SendLocalMessage  } from '@shared/utils';
import { User } from '@src/modules/user/domain/entities';

interface ISetPhoneOTPProvidersUseCaseProps {
    authUser: User;
    dto: SetProvidersDto
}

@Injectable()
export class SetPhoneOTPProvidersUseCase
{
    private readonly logger = new Logger(SetPhoneOTPProvidersUseCase.name);

    constructor(
        private readonly repository: SecurityConfigRepository
    )
    {}

    async handle({ authUser, dto }: ISetPhoneOTPProvidersUseCaseProps)
    {
        const securityConfig = await authUser.securityConfig;

        if (!securityConfig?.otp?.phone?.enable)
        {
            throw new OTPDisabledException(OTPTargetConfigEnum.PHONE);
        }

        securityConfig.otp.phone.providers = dto.providers;

        void this.repository.update(securityConfig);

        return SendLocalMessage(() => 'messages.securityConfig.otp.phone.updatedProviders');
    }
}
