import { RoleRepository } from '@modules/role/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { ILocalMessage, SendLocalMessage } from '@shared/app/utils';

declare interface IEnableOrDisableRoleUseCaseProps {
    id: string;
    enable: boolean;
}

@Injectable()
export class EnableOrDisableRoleUseCase
{
    private readonly logger = new Logger(EnableOrDisableRoleUseCase.name);

    constructor(private readonly repository: RoleRepository)
    {}

    async handle({ id, enable }: IEnableOrDisableRoleUseCaseProps): Promise<ILocalMessage>
    {
        this.logger.log('Getting role...');

        const role = await this.repository.getOne({ id });

        this.logger.log(`Setting role enable: ${enable} ...`);

        role.enable = enable;

        this.logger.log('Updating role...');
        void this.repository.update(role);

        return SendLocalMessage(() =>
        {
            const key = 'messages.role';

            return enable ? key.concat('.enabled') : key.concat('.disabled');
        });
    }
}
