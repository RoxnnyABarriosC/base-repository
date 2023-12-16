import { RoleRepository } from '@modules/role/infrastructure/repositories';
import { ScopeConfigDto } from '@modules/role/presentation/dtos';
import { Injectable, Logger } from '@nestjs/common';
import { ILocalMessage, SendLocalMessage } from '@shared/app/utils';
import { RoleService } from '../services';

declare interface IUpdateScopeConfigRoleUseCaseProps {
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

    async handle({ id, dto: { scopeConfig } }: IUpdateScopeConfigRoleUseCaseProps): Promise<ILocalMessage>
    {
        const role = await this.repository.getOne({ id });

        role.scopeConfig = scopeConfig;

        void await this.repository.update(role);

        return SendLocalMessage(() => 'messages.role.scopeConfigUpdated');
    }
}
