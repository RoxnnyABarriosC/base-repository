import { IsPermissionValid } from '@shared/classValidator/decorators';
import { ArraySet } from '@shared/classValidator/transforms';
import { allPermissionsEnums } from '@src/app.permissions';
import { IsArray, IsNotEmpty } from 'class-validator';

export class PermissionsDto
{
    @IsPermissionValid(allPermissionsEnums, { each: true })
    @IsNotEmpty()
    @IsArray()
    @ArraySet()
    public readonly permissions: string[];
}
