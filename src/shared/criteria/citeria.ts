import { Filter, Sort } from './abstractClass';
import { FilterCriteria } from './filter.criteria';
import { PaginationFilter } from './filters';
import { IUris, PaginationCriteria } from './pagination.criteria';
import { SortCriteria } from './sort.criteria';

declare interface ICriteriaBuilderProps {
    filters: Filter;
    sorts: Sort;
    pagination: PaginationFilter;
    uris: IUris;
}

export class CriteriaBuilder
{
    private readonly sort: SortCriteria;
    private readonly filter: FilterCriteria;
    private readonly pagination: PaginationCriteria;

    constructor({ filters, sorts, pagination, uris }: ICriteriaBuilderProps)
    {
        this.filter = new FilterCriteria(filters);
        this.sort = new SortCriteria(sorts);
        this.pagination = new PaginationCriteria(pagination, uris);
    }

    getFilter<T = any>(): FilterCriteria<T>
    {
        return this.filter;
    }

    getSort<T = any>(): SortCriteria<T>
    {
        return this.sort;
    }

    getPagination(): PaginationCriteria
    {
        return this.pagination;
    }
}
