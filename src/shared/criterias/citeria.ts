import { Filter, Sort } from '@shared/abstractClass';
import {
    FilterCriteria,
    PaginationCriteria,
    PaginationFilter,
    SortCriteria,
    UrisInterface
} from '@shared/criterias';


declare interface Props {
    filters: Filter;
    sorts: Sort;
    pagination: PaginationFilter;
    uris: UrisInterface;
}

export class CriteriaBuilder
{
    private readonly sort: SortCriteria;
    private readonly filter: FilterCriteria;
    private readonly pagination: PaginationCriteria;

    constructor({ filters, sorts, pagination, uris }: Props)
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
