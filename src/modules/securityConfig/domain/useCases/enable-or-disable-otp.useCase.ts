import { PhoneNotDefinedForOTPSendingException } from '@modules/securityConfig/domain/exceptions';
import { SecurityConfigRepository } from '@modules/securityConfig/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { ILocalMessage, SendLocalMessage } from '@shared/app/utils';
import { User } from '@src/modules/user/domain/entities';
import { OTPTargetConfigEnum } from '../enums';

interface IEnableOrDisableOTPUseCaseProps {
    authUser: User;
    target: OTPTargetConfigEnum;
    enable: boolean;
}

@Injectable()
export class EnableOrDisableOTPUseCase
{
    private readonly logger = new Logger(EnableOrDisableOTPUseCase.name);

    constructor(
        private readonly repository: SecurityConfigRepository
    )
    {}

    async handle({ authUser, target, enable }: IEnableOrDisableOTPUseCaseProps): Promise<ILocalMessage>
    {
        const securityConfig = await this.repository.getOneBy({
            condition: { user: { _id: authUser._id } },
            initThrow: true
        });

        if (target === OTPTargetConfigEnum.PHONE && !(authUser?.phone))
        {
            throw new PhoneNotDefinedForOTPSendingException();
        }

        securityConfig.otp[target].enable = enable;

        void this.repository.update(securityConfig);

        return SendLocalMessage(() =>
        {
            const key = `messages.securityConfig.otp.${target}`;

            return enable ? key.concat('.enabled') : key.concat('.disabled');
        });
    }
}
