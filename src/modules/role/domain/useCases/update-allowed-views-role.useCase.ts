import { RoleRepository } from '@modules/role/infrastructure/repositories';
import { AllowedViewsDto } from '@modules/role/presentation/dtos';
import { Injectable, Logger } from '@nestjs/common';
import { ILocalMessage, SendLocalMessage } from '@shared/app/utils';
import { RoleService } from '../services';

declare interface IUpdateAllowedViewsRoleUseCaseProps {
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

    async handle({ id, dto: { allowedViews } }: IUpdateAllowedViewsRoleUseCaseProps): Promise<ILocalMessage>
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
