import { RequestAuth } from '@modules/auth/domain/strategies';
import { ModuleRef } from '@nestjs/core';
import { Policy } from '@shared/app/abstractClass';
import { RolePolicyService } from '../services';

export class SystemRolCanNotBeModifiedPolicy extends Policy
{
    async handle(request: RequestAuth, moduleRef: ModuleRef)
    {
        const service =  moduleRef.get(RolePolicyService);
        await service.checkSystemRolPolicy(request.params['id'], request.query['deletePermanently']);
    }
}
