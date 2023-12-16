import { User } from '@modules/user/domain/entities';
import { Parse } from '@shared/classValidator/transforms';
import { DefaultFilters, Filter } from '@shared/criteria/abstractClass';
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
    public readonly isPrivate: boolean;

    @Expose()
    get DefaultFilters(): DefaultFilters<User>
    {
        return [];
    }
}
