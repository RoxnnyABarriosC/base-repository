import { RequestAuth } from '@modules/auth/domain/strategies';
import { Policy } from '@modules/auth/presentation/guards';
import { ModuleRef } from '@nestjs/core';
import { UserPolicyService } from '../services';

export class AdminUsersOnlyPolicy extends Policy
{
    async handle(request: RequestAuth, moduleRef: ModuleRef)
    {
        const service =  moduleRef.get(UserPolicyService);
        await service.checkAdminUsersOnlyPolicy(request.params['id']);
    }
}
