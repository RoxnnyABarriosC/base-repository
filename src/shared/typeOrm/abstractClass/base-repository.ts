import { Inject, Injectable } from '@nestjs/common';
import { NotFoundCustomException } from '@src/shared/app/exceptions';
import {
    DataSource,
    EntityManager, FindOneOptions,
    ObjectLiteral,
    QueryRunner,
    Repository
} from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import {
    IDeleteParams,
    IGetByParams, IGetOneByParams, IGetOneParams, IRestoreParams, IUpdateBy, Transaction

} from './base-repository.interface';

@Injectable()
export abstract class BaseRepository<T extends ObjectLiteral>
{
    @Inject(DataSource)
    private readonly dataSource: DataSource;

    private _queryRunner: QueryRunner;

    protected constructor(
        protected readonly entityClass:  new (...any) => any,
        protected readonly repository: Repository<T>
    )
    {}

    get queryRunner(): QueryRunner
    {
        if (!this._queryRunner)
        {
            this._queryRunner = this.dataSource.createQueryRunner();
        }

        return this._queryRunner;
    }

    async transaction(transaction: Transaction, isolationLevel?: IsolationLevel)
    {
        if (isolationLevel)
        {
            void await this.dataSource.transaction(isolationLevel, transaction);
        }
        else
        {
            void await this.dataSource.transaction(transaction);
        }
    }

    async save(entities: T | T[], transactionManager?: EntityManager): Promise<T | T[]>
    {
        return await ((transactionManager ?? this.repository) as Repository<T>).save(entities as any);
    }

    async update(entities: T | T[], transactionManager?: EntityManager): Promise<T | T[]>
    {
        return await this.save(entities, transactionManager);
    }

    async updateBy(
        { condition, partial }: IUpdateBy<T>,
        transactionManager?: EntityManager
    ): Promise<UpdateResult>
    {
        const exist = await this.repository.existsBy(condition);

        if (!exist)
        {
            throw new NotFoundCustomException(this.entityClass.name);
        }

        return transactionManager ? await transactionManager.update(this.entityClass, condition, partial)
            : await this.repository.update(condition, partial);
    }

    async restore(
        { id, ...config }: IRestoreParams<T>,
        transactionManager?: EntityManager
    ): Promise<T>
    {
        const entity: any = await this.repository.findOne({
            withDeleted: true,
            where: { _id: id } as any,
            ...config
        });

        if (!entity)
        {
            throw new NotFoundCustomException(this.entityClass.name);
        }

        // eslint-disable-next-line no-unused-expressions
        transactionManager ? await transactionManager.restore(this.entityClass, id)
            : void await this.repository.restore(id);

        entity.deletedAt = null;

        return entity;
    }

    async delete(
        { id, softDelete = true, withDeleted = false, ...config  }: IDeleteParams<T>,
        transactionManager?: EntityManager
    ): Promise<T>
    {
        const entity: any = await this.repository.findOne({
            withDeleted,
            where: { _id: id } as any,
            ...config
        });

        if (!entity)
        {
            throw new NotFoundCustomException(this.entityClass.name);
        }

        if (softDelete)
        {
            // eslint-disable-next-line no-unused-expressions
            transactionManager ? await transactionManager.softDelete(this.entityClass, id)
                : void await this.repository.softDelete(id);
        }
        else
        {
            // eslint-disable-next-line no-unused-expressions
            transactionManager ? await transactionManager.delete(this.entityClass, id)
                : void await this.repository.delete(id);
        }

        entity.deletedAt = Date.now();

        return entity;
    }

    async getOne(
        { id, withDeleted = false, ...config }: IGetOneParams<T>
    ): Promise<T>
    {
        const entity = await this.repository.findOne({
            withDeleted,
            where: { _id: id } as any,
            ...config
        });

        if (!entity)
        {
            throw new NotFoundCustomException(this.entityClass.name);
        }

        return entity;
    }

    async getOneBy(
        { condition, initThrow = true, withDeleted = false, ...config }: IGetOneByParams<T>
    ): Promise<T | null>
    {
        const entity = await this.repository.findOne({
            withDeleted,
            where: condition,
            ...config
        });

        if (initThrow && !entity)
        {
            throw new NotFoundCustomException(this.entityClass.name);
        }

        return entity;
    }

    async getBy(
        { condition, initThrow = false, withDeleted = false, ...config  }: IGetByParams<T>
    ): Promise<T[]>
    {
        const entities = await this.repository.find({
            withDeleted,
            where: condition,
            ...config
        });

        if (initThrow && !entities.length)
        {
            throw new NotFoundCustomException(this.entityClass.name);
        }

        return entities;
    }

    /**
     *
     * @param condition
     * @param select
     * @param initThrow
     * @param withDeleted
     *
     * @deprecated
     */
    async exist<D = any>({ condition, select, initThrow = false, withDeleted = false }): Promise<D>
    {
        const conditionMap: FindOneOptions = {
            select,
            where: condition,
            loadEagerRelations: false,
            withDeleted
        };

        const exist = await this.repository.findOne(conditionMap as FindOneOptions<T>);

        if (initThrow && !exist)
        {
            throw new NotFoundCustomException(this.entityClass.name);
        }

        return exist as unknown as D;
    }
}

