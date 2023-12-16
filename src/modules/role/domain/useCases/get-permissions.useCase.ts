import { Injectable, Logger } from '@nestjs/common';
import { GroupPermissions } from '@shared/app/factories';
import { AllAppPermissions } from '@src/app.permissions';

@Injectable()
export class GetPermissionsUseCase
{
    private readonly logger = new Logger(GetPermissionsUseCase.name);

    async handle(): Promise<GroupPermissions<any>[]>
    {
        return AllAppPermissions.groupPermissions();
    }
}
