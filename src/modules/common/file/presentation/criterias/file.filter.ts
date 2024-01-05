import { RoleFilters } from '@modules/role/presentation/criterias';
import { ValidateIfPropertyExists } from '@shared/classValidator/decorators';
import { Parse } from '@shared/classValidator/transforms';
import { Trim } from '@shared/classValidator/transforms/trim.decorator';
import { Filter } from '@shared/criteria/abstractClass';
import { RenameProperty } from '@shared/decorators';
import { IsBoolean, IsString } from 'class-validator';

export enum FileFilters {
    SEARCH = 'search',
    PARTIAL_REMOVED = 'deletedAt',
    WITH_PARTIAL_REMOVED = 'withPartialRemoved',
    IS_PRIVATE = 'enable',
}

// TODO: cargar a la metadata el campo referencial contr la db
export class FileFilter extends Filter
{
    @IsString()
    @Trim()
    @ValidateIfPropertyExists()
    public readonly search: string;

    @IsBoolean()
    @Parse()
    @ValidateIfPropertyExists()
    public readonly isPrivate: boolean;

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
