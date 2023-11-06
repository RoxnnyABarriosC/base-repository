import { Role } from '@modules/role/domain/entities';
import { DefaultFilters, Filter } from '@shared/abstractClass';
import { ParseBoolean } from '@shared/decorators';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export enum RoleFilters {
    ENABLE = 'enable',
    OF_SYSTEM = 'ofSystem',
    SEARCH = 'search',
    PERMISSIONS = 'permissions',
    ALLOWED_VIEWS = 'allowedViews',
    SCOPE_CONFIG = 'scopeConfig',
    PARTIAL_REMOVED = 'partialRemoved',
    WITH_PARTIAL_REMOVED = 'withPartialRemoved'
}

export class RoleFilter extends Filter
{
    @IsOptional()
    public readonly search: string;

    @IsOptional()
    @ParseBoolean()
    public readonly enable: boolean;

    @IsOptional()
    @ParseBoolean()
    public readonly ofSystem: boolean;

    @IsOptional()
    @IsString({ each: true })
    public readonly permissions: string;

    @IsOptional()
    @IsString({ each: true })
    public readonly allowedViews: string;

    @IsOptional()
    @ParseBoolean()
    public readonly withPartialRemoved: boolean;

    @IsOptional()
    @ParseBoolean()
    public readonly partialRemoved: boolean;

    @Expose()
    get DefaultFilters(): DefaultFilters<Role>
    {
        return [];
    }
}
