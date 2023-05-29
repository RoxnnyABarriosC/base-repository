import { RoleService } from '@modules/auth/role/domain/services';
import { RoleRepository } from '@modules/auth/role/infrastructure/repositories';
import { ScopeConfigDto } from '@modules/auth/role/presentation/dtos';
import { Injectable, Logger } from '@nestjs/common';
import { LocalMessageInterface } from '@shared/interfaces';
import { SendLocalMessage } from '@shared/utils';

interface Props {
    id: string;
    dto: ScopeConfigDto;
}


@Injectable()
export class UpdateScopeConfigRoleUseCase
{
    private readonly logger = new Logger(UpdateScopeConfigRoleUseCase.name);

    constructor(
        private readonly repository: RoleRepository,
        private readonly service: RoleService
    )
    {}

    async handle({ id, dto: { scopeConfig } }: Props): Promise<LocalMessageInterface>
    {
        const role = await this.repository.getOne({ id });

        role.scopeConfig = scopeConfig;

        void await this.repository.update(role);

        return SendLocalMessage(() => 'messages.role.scopeConfigUpdated');
    }
}
