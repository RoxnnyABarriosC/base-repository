export declare interface IByOptions
{
    initThrow?: boolean | undefined;
    populate?: string | string[] | boolean | undefined;
}

export declare interface IGetOneParams {
    id: string;
    withDeleted?: boolean;
}

export declare interface IDeleteParams {
    id: string;
    softDelete?: boolean;
    withDeleted?: boolean;
}

export declare interface IGetOneByParams {
    condition: Record<string, any>;
    options?: IByOptions;
    withDeleted?: boolean;
    relations?: string[];
}

export declare interface IExistParams {
    condition: Record<string, any> | Record<string, any>[],
    select: string[];
    initThrow?: boolean;
    withDeleted?: boolean
}

export declare interface IGetByParams
    extends Omit<IGetOneByParams, 'withDeleted' | 'relations'> {}
