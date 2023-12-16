import { RequestAuth } from '@modules/auth/domain/strategies';
import { Policy } from '@modules/auth/presentation/guards';
import { ModuleRef } from '@nestjs/core';
import { UserPolicyService } from '../services';

export class AdminCantUpdateEmailPolicy extends Policy
{
    async handle(request: RequestAuth, moduleRef: ModuleRef)
    {
        const service =  moduleRef.get(UserPolicyService, { strict: false });
        service.checkAdminCantUpdateEmailPolicy(request.user.data, request.body['email']);
    }
}
