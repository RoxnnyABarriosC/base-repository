import { NotAllowedRemoveASystemRolException } from '@modules/auth/role/domain/exceptions';
import { RoleRepository } from '@modules/auth/role/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { LocalMessageInterface } from '@shared/interfaces';
import { SendLocalMessage } from '@shared/utils';

interface Props {
    id: string;
    enable: boolean;
}

@Injectable()
export class EnableOrDisableRoleUseCase
{
    private readonly logger = new Logger(EnableOrDisableRoleUseCase.name);

    constructor(private readonly repository: RoleRepository)
    {}

    async handle({ id, enable }: Props): Promise<LocalMessageInterface>
    {
        this.logger.log('Getting role...');

        const role = await this.repository.getOne({ id });

        this.logger.log('Checking if role is system...');
        if (role.ofSystem)
        {
            throw new NotAllowedRemoveASystemRolException();
        }

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
