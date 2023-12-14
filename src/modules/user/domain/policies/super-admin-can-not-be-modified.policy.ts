import { RequestAuth } from '@modules/auth/domain/strategies';
import { Policy } from '@modules/auth/presentation/guards';
import { UserService } from '@modules/user/domain/services';
import { ModuleRef } from '@nestjs/core';

export class SuperAdminCanNotBeModifiedPolicy extends Policy
{
    async handle(request: RequestAuth, moduleRef: ModuleRef)
    {
        const service =  moduleRef.get(UserService);
        await service.checkSuperAdminPolicy(request.params['id'], request.query['deletePermanently']);
    }
}
