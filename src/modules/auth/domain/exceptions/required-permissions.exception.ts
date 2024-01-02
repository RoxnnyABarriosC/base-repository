import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/app/exceptions';

export class RequiredPermissionsException extends HttpException
{
    private readonly requiredPermissions: string[];

    constructor(
        private readonly requiresAllPermissions: boolean,
        ... permissions: string[])
    {
        super(HttpStatus.FORBIDDEN, 'exceptions.auth.permissionsRequired');
        this.requiredPermissions = permissions;
    }
}
