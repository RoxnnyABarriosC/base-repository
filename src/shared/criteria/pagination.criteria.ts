import configuration from '@config/configuration';
import { PaginationFilter } from './filters';

export interface IUris {
    fullUrl: string;
    base: string;
}

export class PaginationCriteria
{
    private readonly limit: number;
    private readonly offset: number;
    private readonly exist: boolean = false;
    private pagination: PaginationFilter;
    private readonly host: string;
    private readonly url: string;

    constructor(pagination: PaginationFilter, uris: IUris)
    {
        const config = configuration();
        this.url = uris.fullUrl;
        this.pagination = pagination;
        this.limit = pagination?.limit ? +this.pagination.limit : config.pagination.limit;
        this.offset = pagination?.offset ? +this.pagination.offset : 0;
        this.exist = !!(pagination?.offset || pagination?.limit);
        this.host = uris.base;
    }

    getPath(): string
    {
        return this.host;
    }

    getLimit(): number
    {
        return this.limit;
    }

    getOffset(): number
    {
        return this.offset;
    }

    getCurrentUrl(): string
    {
        return this.exist ? this.url : '';
    }

    getNextUrl(): string
    {
        let url = '';

        if (this.exist)
        {
            const offset = this.offset + this.limit;

            url = this.url;
            const searchValue = `pagination[offset]=${this.pagination.offset}`;
            const newValue = `pagination[offset]=${offset}`;

            url = url.replace(searchValue, newValue);
        }

        return url;
    }

    getExist(): boolean
    {
        return this.exist;
    }
}
