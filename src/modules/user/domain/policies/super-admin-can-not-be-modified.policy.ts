import { RequestAuth } from '@modules/auth/domain/strategies';
import { ModuleRef } from '@nestjs/core';
import { Policy } from '@shared/app/abstractClass';
import { UserPolicyService } from '../services';

export class SuperAdminCanNotBeModifiedPolicy extends Policy
{
    async handle(request: RequestAuth, moduleRef: ModuleRef)
    {
        const service =  moduleRef.get(UserPolicyService);
        await service.checkSuperAdminCanNotBeModifiedPolicy(request.params['id'], request.query['deletePermanently']);
    }
}
