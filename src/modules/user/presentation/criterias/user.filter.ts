import { RoleFilters } from '@modules/role/presentation/criterias';
import { User } from '@modules/user/domain/entities';
import { IsPermissionValid, ValidateIfPropertyExists } from '@shared/classValidator/decorators';
import { Parse, StringToArray } from '@shared/classValidator/transforms';
import { Trim } from '@shared/classValidator/transforms/trim.decorator';
import { Filter } from '@shared/criteria/abstractClass';
import { RenameProperty } from '@shared/decorators';
import { allPermissionsEnums } from '@src/app.permissions';
import { IsBoolean,  IsString } from 'class-validator';

export enum UserFilters {
    SEARCH = 'search',
    PERMISSIONS = 'permissions',
    ENABLE = 'enable',
    VERIFY = 'verify',
    IS_SUPER_ADMIN = 'isSuperAdmin',
    PARTIAL_REMOVED = 'deletedAt',
    WITH_PARTIAL_REMOVED = 'withPartialRemoved',
}

// TODO: cargar a la metadata el campo referencial contr la db
export class UserFilter extends Filter<User>
{
    @IsString()
    @Trim()
    @ValidateIfPropertyExists()
    public readonly search: string;

    @IsBoolean()
    @Parse()
    @ValidateIfPropertyExists()
    public readonly enable: boolean;

    @IsBoolean()
    @Parse()
    @ValidateIfPropertyExists()
    public readonly verify: boolean;

    @IsBoolean()
    @Parse()
    @ValidateIfPropertyExists()
    public readonly isSuperAdmin: boolean;

    @StringToArray()
    @IsPermissionValid(allPermissionsEnums, { each: true })
    @ValidateIfPropertyExists()
    public readonly permissions: string[];

    @IsBoolean()
    @Parse()
    @ValidateIfPropertyExists()
    public readonly withPartialRemoved: boolean;

    @IsBoolean()
    @RenameProperty(RoleFilters.PARTIAL_REMOVED)
    @Parse()
    @ValidateIfPropertyExists()
    public readonly partialRemoved: boolean;
}
