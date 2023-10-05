import { OtpTypeEnum } from '@modules/auth/otp/domain/enums';
import { OtpDisabledException } from '@modules/auth/otp/domain/exceptions';
import { OTPRepository } from '@modules/auth/otp/infrastructure/repositories';
import { SetProvidersDto } from '@modules/auth/otp/presentation/dtos';
import { Injectable, Logger } from '@nestjs/common';
import {  SendLocalMessage  } from '@shared/utils';
import { User } from '@src/modules/auth/user/domain/entities';

interface Props {
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

    async handle({ authUser, dto }: Props)
    {
        const otp = await this.repository.getOneBy({
            condition: { user: { _id: authUser._id } },
            options: {
                initThrow: true
            }
        });

        if (!otp?.config?.phone?.enable)
        {
            throw new OtpDisabledException(OtpTypeEnum.PHONE);
        }

        otp.config.phone.providers = dto.providers;

        void this.repository.update(otp);

        return SendLocalMessage(() => 'messages.otp.phone.updatedProviders');
    }
}
