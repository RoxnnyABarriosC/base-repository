import { RequestAuth } from '@modules/auth/domain/strategies';
import { ModuleRef } from '@nestjs/core';
import { Policy } from '@shared/app/abstractClass';
import { UserPolicyService } from '../services';

export class AdminCantUpdateUserNamePolicy extends Policy
{
    async handle(request: RequestAuth, moduleRef: ModuleRef)
    {
        const service =  moduleRef.get(UserPolicyService, { strict: false });
        service.checkAdminCantUpdateUserNamePolicy(request.user.data, request.body['userName']);
    }
}
