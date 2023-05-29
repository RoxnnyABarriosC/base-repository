import { User } from '@modules/auth/user/domain/entities';
import { DefaultFilters, Filter } from '@shared/abstractClass';
import { ParseBoolean } from '@shared/decorators';
import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export enum FileFilters {
    SEARCH = 'search',
    PARTIAL_REMOVED = 'partialRemoved',
    WITH_PARTIAL_REMOVED = 'withPartialRemoved',
    IS_PRIVATE = 'enable',
}

// TODO: cargar a la metadata el campo referencial contr la db
export class FileFilter extends Filter
{
    @IsOptional()
    public readonly search: string;

    @IsOptional()
    @ParseBoolean()
    @IsBoolean()
    public readonly withPartialRemoved: boolean;

    @IsOptional()
    @ParseBoolean()
    @IsBoolean()
    public readonly partialRemoved: boolean;

    @IsOptional()
    @ParseBoolean()
    @IsBoolean()
    public readonly isPrivate: boolean;

    @Expose()
    get DefaultFilters(): DefaultFilters<User>
    {
        return [];
    }
}
