import { Injectable, Logger } from '@nestjs/common';
import { GroupPermissions } from '@shared/factories';
import { AppPermissionsFactory } from '@src/app.permissions';

@Injectable()
export class GetPermissionsUseCase
{
    private readonly logger = new Logger(GetPermissionsUseCase.name);

    async handle(): Promise<GroupPermissions<any>[]>
    {
        return AppPermissionsFactory.groupPermissions();
    }
}
