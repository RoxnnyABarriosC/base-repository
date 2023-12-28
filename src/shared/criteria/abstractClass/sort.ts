import { RenameProperty } from '@shared/decorators';
import { DEFAULT_PROPERTIES } from '../constants';
import { SortEnum } from '../enums';

export type DefaultSorts<E> = {
    [Key in keyof E | string ]?: SortEnum;
}[]

export abstract class Sort<E = any>
{
    @RenameProperty(DEFAULT_PROPERTIES)
    DefaultSorts(): DefaultSorts<E>
    {
        return [];
    }
}
