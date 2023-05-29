import { UserService } from '@modules/auth/user/domain/services';
import { UserRepository } from '@modules/auth/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { LocalMessageInterface } from '@shared/interfaces';
import { SendLocalMessage } from '@shared/utils';

interface Props {
    id: string;
    enable: boolean;
}

@Injectable()
export class EnableOrDisableUserUseCase
{
    private readonly logger = new Logger(EnableOrDisableUserUseCase.name);

    constructor(
        private readonly repository: UserRepository,
        private readonly service: UserService
    )
    {}

    async handle({ id, enable }: Props): Promise<LocalMessageInterface>
    {
        this.logger.log('Getting user...');

        const user = await this.repository.getOne({ id });

        this.logger.log('Checking if user is super admin...');
        void this.service.checkSuperAdmin(user);

        this.logger.log(`Setting user enable: ${enable} ...`);

        user.enable = enable;

        this.logger.log('Updating user...');
        void this.repository.update(user);

        return SendLocalMessage(() =>
        {
            const key = 'messages.user';

            return enable ? key.concat('.enabled') : key.concat('.disabled');
        });
    }
}
