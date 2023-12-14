import { RequestAuth } from '@modules/auth/domain/strategies';
import { Policy } from '@modules/auth/presentation/guards';
import { UserService } from '@modules/user/domain/services';
import { ModuleRef } from '@nestjs/core';

export class DontDeleteYourselfPolicy extends Policy
{
    async handle(request: RequestAuth, moduleRef: ModuleRef)
    {
        const service =  moduleRef.get(UserService);
        await service.checkYourselfPolicy(request.user.data._id, request.params['id'], request.query['deletePermanently']);
    }
}
