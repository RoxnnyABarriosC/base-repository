import { RoleService } from '@modules/auth/role/domain/services';
import { RoleRepository } from '@modules/auth/role/infrastructure/repositories';
import { AllowedViewsDto } from '@modules/auth/role/presentation/dtos';
import { Injectable, Logger } from '@nestjs/common';
import { LocalMessageInterface } from '@shared/interfaces';
import { SendLocalMessage } from '@shared/utils';

interface Props {
    id: string;
    dto: AllowedViewsDto;
}

@Injectable()
export class UpdateAllowedViewsRoleUseCase
{
    private readonly logger = new Logger(UpdateAllowedViewsRoleUseCase.name);

    constructor(
        private readonly repository: RoleRepository,
        private readonly service: RoleService
    )
    {}

    async handle({ id, dto: { allowedViews } }: Props): Promise<LocalMessageInterface>
    {
        this.logger.log('Validating allowed views...');
        void await this.service.validateAllowedViews(allowedViews);

        this.logger.log('Getting role...');
        const role = await this.repository.getOne({ id });

        this.logger.log('Updating allowed views...');
        role.AllowedViews = allowedViews;

        void await this.repository.update(role);

        return SendLocalMessage(() => 'messages.role.allowedViewsUpdated');
    }
}
