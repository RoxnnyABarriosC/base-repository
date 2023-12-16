import { RequestAuth } from '@modules/auth/domain/strategies';
import { Policy } from '@modules/auth/presentation/guards';
import { ModuleRef } from '@nestjs/core';
import { RolePolicyService } from '../services';

export class NotAllowedRemoveASystemRolPolicy extends Policy
{
    async handle(request: RequestAuth, moduleRef: ModuleRef)
    {
        const service =  moduleRef.get(RolePolicyService);
        await service.checkNotAllowedRemoveASystemRolPolicy(request.params['id'], request.query['deletePermanently']);
    }
}
