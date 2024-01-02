import { MapCriteria } from '@shared/criteria/map.criteria';
import { Filter, Sort } from './abstractClass';
import { PaginationFilter } from './filters';
import { IUris, PaginationCriteria } from './pagination.criteria';

declare interface ICriteriaBuilderProps {
    filters: Filter;
    sorts: Sort;
    pagination: PaginationFilter;
    uris: IUris;
}

export class CriteriaBuilder
{
    private readonly sort: MapCriteria;
    private readonly filter: MapCriteria;
    private readonly pagination: PaginationCriteria;

    constructor({ filters, sorts, pagination, uris }: ICriteriaBuilderProps)
    {
        this.filter = new MapCriteria(filters);
        this.sort = new MapCriteria(sorts);
        this.pagination = new PaginationCriteria(pagination, uris);
    }

    getFilter<T = any>(): MapCriteria<T>
    {
        return this.filter;
    }

    getSort<T = any>(): MapCriteria<T>
    {
        return this.sort;
    }

    getPagination(): PaginationCriteria
    {
        return this.pagination;
    }
}
