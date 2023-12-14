import { RequestAuth } from '@modules/auth/domain/strategies';
import { Policy } from '@modules/auth/presentation/guards';
import { RoleService } from '@modules/role/domain/services';
import { ModuleRef } from '@nestjs/core';

export class NotAllowedRemoveASystemRolPolicy extends Policy
{
    async handle(request: RequestAuth, moduleRef: ModuleRef)
    {
        const service =  moduleRef.get(RoleService);
        await service.checkNotAllowedRemoveASystemRolPolicy(request.params['id'], request.query['deletePermanently']);
    }
}
