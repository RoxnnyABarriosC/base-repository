import { BaseSerializer } from '@shared/classValidator/abstractClass';
import { Expose } from 'class-transformer';
import { BasePaginator } from '../pagination';

export class PaginatorSerializer extends BaseSerializer
{
    @Expose() public total: number;
    @Expose() public offset: number;
    @Expose() public limit: number;
    @Expose() public perPage: number;
    @Expose() public currentPage: number;
    @Expose() public lastPage: number;
    @Expose() public from: number;
    @Expose() public to: number;
    @Expose() public path: string;
    @Expose() public firstUrl: string;
    @Expose() public lastUrl: string;
    @Expose() public nextUrl: string;
    @Expose() public prevUrl: string;
    @Expose() public currentUrl: string;

    override async build(data: BasePaginator): Promise<void>
    {
        this.total = data.getTotal();
        this.offset = data.getOffset();
        this.limit = data.getLimit();
        this.perPage = data.getPerPage();
        this.currentPage = data.getCurrentPage();
        this.lastPage = data.getLasPage();
        this.from = data.getFrom();
        this.to = data.getTo();
        this.path = data.getPath();
        this.firstUrl = data.getFirstUrl();
        this.lastUrl = data.getLastUrl();
        this.nextUrl = data.getNextUrl();
        this.prevUrl = data.getPrevUrl();
        this.currentUrl = data.getCurrentUrl();
    }
}

