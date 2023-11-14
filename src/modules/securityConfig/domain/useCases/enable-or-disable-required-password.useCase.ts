import { CannotDisableRequiredPasswordException } from '@modules/securityConfig/domain/exceptions';
import { SecurityConfigRepository } from '@modules/securityConfig/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import {  SendLocalMessage  } from '@shared/utils';
import { User } from '@src/modules/user/domain/entities';

interface IEnableOrDisableRequiredPasswordUseCaseProps {
    authUser: User;
    enable: boolean;
}

@Injectable()
export class EnableOrDisableRequiredPasswordUseCase
{
    private readonly logger = new Logger(EnableOrDisableRequiredPasswordUseCase.name);

    constructor(
        private readonly repository: SecurityConfigRepository
    )
    {}

    async handle({ authUser, enable }: IEnableOrDisableRequiredPasswordUseCaseProps)
    {
        const securityConfig = await this.repository.getOneBy({
            condition: { user: { _id: authUser._id } },
            options: {
                initThrow: true
            }
        });

        if (!enable && (!securityConfig.otp.email.enable && !securityConfig.otp.phone.enable))
        {
            throw new CannotDisableRequiredPasswordException();
        }

        securityConfig.requiredPassword = enable;

        void this.repository.update(securityConfig);

        return SendLocalMessage(() =>
        {
            const key = 'messages.securityConfig.requiredPassword';

            return enable ? key.concat('.enabled') : key.concat('.disabled');
        });
    }
}
