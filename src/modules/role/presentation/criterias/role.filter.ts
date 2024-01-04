import { IsPermissionValid, ValidateIfPropertyExists } from '@shared/classValidator/decorators';
import { Parse, StringToArray } from '@shared/classValidator/transforms';
import { Trim } from '@shared/classValidator/transforms/trim.decorator';
import { Filter } from '@shared/criteria/abstractClass';
import { RenameProperty } from '@shared/decorators';
import { allPermissionsEnums } from '@src/app.permissions';
import { IsBoolean, IsString } from 'class-validator';

export enum RoleFilters {
    ENABLE = 'enable',
    OF_SYSTEM = 'ofSystem',
    SEARCH = 'search',
    PERMISSIONS = 'permissions',
    ALLOWED_VIEWS = 'allowedViews',
    SCOPE_CONFIG = 'scopeConfig',
    PARTIAL_REMOVED = 'deletedAt',
    WITH_PARTIAL_REMOVED = 'withPartialRemoved'
}

export class RoleFilter extends Filter
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
    public readonly ofSystem: boolean;

    @StringToArray()
    @IsPermissionValid(allPermissionsEnums, { each: true })
    @ValidateIfPropertyExists()
    public readonly permissions: string[];

    @IsString({ each: true })
    @StringToArray()
    @ValidateIfPropertyExists()
    public readonly allowedViews: string[];

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
