import { DEFAULT_PROPERTIES } from '@shared/criteria/constants';
import { RenameProperty } from '@shared/decorators';

export type DefaultFilters<E> = {
    [Key in keyof E]?: any;
}[]

export abstract class Filter<E = any>
{
    @RenameProperty(DEFAULT_PROPERTIES)
    DefaultFilters(): DefaultFilters<E>
    {
        return [];
    }
}
