import { EntityManager, FindOptionsRelations, FindOptionsSelect } from 'typeorm';
import { FindOptionsOrder } from 'typeorm/find-options/FindOptionsOrder';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

export declare type Transaction = (transactionManager: EntityManager) => Promise<void>

declare interface ICache {
    id: any;
    milliseconds: number;
}

export declare interface ICommonParams<E> {
    initThrow?: boolean;
    select?: FindOptionsSelect<E>
    relations?: FindOptionsRelations<E>
    withDeleted?: boolean;
    loadEagerRelations?: false;
    cache?: boolean | number | ICache;
    order?: FindOptionsOrder<E>
}

export declare interface IUpdateBy<E> {
    condition: FindOptionsWhere<E>,
    partial: Partial<E>
}

export declare interface IRestoreParams<E> extends Omit<ICommonParams<E>, 'withDeleted' | 'initThrow'> {
    id: string;
}

export declare interface IDeleteParams<E> extends Omit<ICommonParams<E>, 'initThrow'> {
    id: string;
    softDelete?: boolean;
}

export declare interface IGetOneParams<E> extends Omit<ICommonParams<E>, 'initThrow'> {
    id: string;
}

export declare interface IGetOneByParams<E> extends ICommonParams<E> {
    condition: FindOptionsWhere<E>[] | FindOptionsWhere<E>;
}

export declare interface IGetByParams<T>
    extends IGetOneByParams<T> {}

