import { OtpTypeEnum } from '@modules/otp/domain/enums';
import { OtpDisabledException } from '@modules/otp/domain/exceptions';
import { OTPRepository } from '@modules/otp/infrastructure/repositories';
import { SetProvidersDto } from '@modules/otp/presentation/dtos';
import { Injectable, Logger } from '@nestjs/common';
import {  SendLocalMessage  } from '@shared/utils';
import { User } from '@src/modules/user/domain/entities';

interface ISetPhoneOtpProvidersOtpUseCaseProps {
    authUser: User;
    dto: SetProvidersDto
}

@Injectable()
export class SetPhoneOtpProvidersOtpUseCase
{
    private readonly logger = new Logger(SetPhoneOtpProvidersOtpUseCase.name);

    constructor(
        private readonly repository: OTPRepository
    )
    {}

    async handle({ authUser, dto }: ISetPhoneOtpProvidersOtpUseCaseProps)
    {
        const otp = await authUser.otp;

        if (!otp?.config?.phone?.enable)
        {
            throw new OtpDisabledException(OtpTypeEnum.PHONE);
        }

        otp.config.phone.providers = dto.providers;

        void this.repository.update(otp);

        return SendLocalMessage(() => 'messages.otp.phone.updatedProviders');
    }
}
