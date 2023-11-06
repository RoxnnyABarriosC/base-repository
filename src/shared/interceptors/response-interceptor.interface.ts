import { PaginatorSerializer } from '@shared/pagination';

export declare interface IAppResponse
{
    folio: string;
    isArray: boolean;
    isCached: boolean;
    data: any;
    pagination?: PaginatorSerializer;
    metadata: object;
}
