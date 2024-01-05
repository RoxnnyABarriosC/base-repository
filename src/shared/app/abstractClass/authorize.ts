import { ModuleRef, Reflector } from '@nestjs/core';
import { PolicyType } from './policy';


export abstract class Authorize<T>
{
    protected readonly reflector: Reflector;
    protected readonly moduleRef: ModuleRef;


    protected async execPolicyHandler(policies: PolicyType[], request: T): Promise<void>
    {
        for (const policy of policies)
        {
            await (new policy()).handle(request, this.moduleRef);
        }
    }
}
