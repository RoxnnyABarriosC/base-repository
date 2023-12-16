import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { ILocalMessage, SendLocalMessage } from '@shared/app/utils';

declare interface IEnableOrDisableUserUseCaseProps {
    id: string;
    enable: boolean;
}

@Injectable()
export class EnableOrDisableUserUseCase
{
    private readonly logger = new Logger(EnableOrDisableUserUseCase.name);

    constructor(
        private readonly repository: UserRepository
    )
    {}

    async handle({ id, enable }: IEnableOrDisableUserUseCaseProps): Promise<ILocalMessage>
    {
        this.logger.log('Getting user...');

        const user = await this.repository.getOne({ id });

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
