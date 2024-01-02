import { PaginatorSerializer } from '@shared/criteria/serializers';

export declare interface IAppResponse
{
    folio: string;
    isArray: boolean;
    isCached: boolean;
    data: any;
    pagination?: PaginatorSerializer;
    metadata: object;
}
