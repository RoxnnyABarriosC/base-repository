import { User } from '@modules/user/domain/entities';
import { Parse } from '@shared/classValidator/transforms';
import { DefaultFilters, Filter } from '@shared/criteria/abstractClass';
import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export enum UserFilters {
    SEARCH = 'search',
    PARTIAL_REMOVED = 'partialRemoved',
    WITH_PARTIAL_REMOVED = 'withPartialRemoved',
    PERMISSIONS = 'permissions',
    ENABLE = 'enable',
    VERIFY = 'verify',
    IS_SUPER_ADMIN = 'isSuperAdmin',
}

// TODO: cargar a la metadata el campo referencial contr la db
export class UserFilter extends Filter
{
    @IsOptional()
    public readonly search: string;

    @IsOptional()
    @Parse()
    @IsBoolean()
    public readonly withPartialRemoved: boolean;

    @IsOptional()
    @Parse()
    @IsBoolean()
    public readonly partialRemoved: boolean;

    @IsOptional()
    @Parse()
    @IsBoolean()
    public readonly enable: boolean;

    @IsOptional()
    @Parse()
    @IsBoolean()
    public readonly verify: boolean;

    @IsOptional()
    @Parse()
    @IsBoolean()
    public readonly isSuperAdmin: boolean;

    @IsOptional()
    @IsString({ each: true })
    public readonly permissions: string;

    @Expose()
    get DefaultFilters(): DefaultFilters<User>
    {
        return [];
    }
}
