import { ArraySet, IsPermissionValid } from '@shared/decorators';
import { allPermissionsEnums } from '@src/app.permissions';
import { IsArray, IsNotEmpty } from 'class-validator';

export class PermissionsDto
{
    @IsNotEmpty()
    @IsArray()
    @ArraySet()
    @IsPermissionValid(...allPermissionsEnums)
    public readonly permissions: string[];
}
