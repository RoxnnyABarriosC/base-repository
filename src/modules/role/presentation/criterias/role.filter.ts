import { Role } from '@modules/role/domain/entities';
import { Parse } from '@shared/classValidator/transforms';
import { DefaultFilters, Filter } from '@shared/criteria/abstractClass';
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
    @Parse()
    public readonly enable: boolean;

    @IsOptional()
    @Parse()
    public readonly ofSystem: boolean;

    @IsOptional()
    @IsString({ each: true })
    public readonly permissions: string;

    @IsOptional()
    @IsString({ each: true })
    public readonly allowedViews: string;

    @IsOptional()
    @Parse()
    public readonly withPartialRemoved: boolean;

    @IsOptional()
    @Parse()
    public readonly partialRemoved: boolean;

    @Expose()
    get DefaultFilters(): DefaultFilters<Role>
    {
        return [];
    }
}
