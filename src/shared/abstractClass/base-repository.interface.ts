export declare interface ByOptionsInterface
{
    initThrow?: boolean | undefined;
    populate?: string | string[] | boolean | undefined;
}

export declare interface GetOneParamsInterface {
    id: string;
    withDeleted?: boolean;
}

export declare interface DeleteParamsInterface {
    id: string;
    softDelete?: boolean;
    withDeleted?: boolean;
}

export declare interface GetOneByParamsInterface {
    condition: Record<string, any>;
    options?: ByOptionsInterface;
    withDeleted?: boolean;
    relations?: string[];
}

export declare interface ExistParamsInterface {
    condition: Record<string, any> | Record<string, any>[],
    select: string[];
    initThrow?: boolean;
    withDeleted?: boolean
}

export declare interface GetByParamsInterface
    extends Omit<GetOneByParamsInterface, 'withDeleted' | 'relations'> {}
