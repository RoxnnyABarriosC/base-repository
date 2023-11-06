import { OtpTypeEnum } from '@modules/otp/domain/enums';
import { OTPRepository } from '@modules/otp/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import {  SendLocalMessage  } from '@shared/utils';
import { User } from '@src/modules/user/domain/entities';

interface IEnableOrDisableOtpUseCaseProps {
    authUser: User;
    target: OtpTypeEnum;
    enable: boolean;
}

@Injectable()
export class EnableOrDisableOtpUseCase
{
    private readonly logger = new Logger(EnableOrDisableOtpUseCase.name);

    constructor(
        private readonly repository: OTPRepository
    )
    {}

    async handle({ authUser, target, enable }: IEnableOrDisableOtpUseCaseProps)
    {
        const otp = await this.repository.getOneBy({
            condition: { user: { _id: authUser._id } },
            options: {
                initThrow: true
            }
        });

        otp.config[target].enable = enable;

        void this.repository.update(otp);

        return SendLocalMessage(() =>
        {
            const key = `messages.otp.${target}`;

            return enable ? key.concat('.enabled') : key.concat('.disabled');
        });
    }
}
