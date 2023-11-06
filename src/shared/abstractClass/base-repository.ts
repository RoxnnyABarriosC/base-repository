import { Inject, Injectable } from '@nestjs/common';
import { NotFoundCustomException } from '@shared/exceptions';
import {
    DataSource,
    EntityManager,
    FindOneOptions,
    ObjectLiteral,
    QueryRunner,
    Repository
} from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';
import type {
    IDeleteParams,
    IExistParams, IGetByParams, IGetOneByParams, IGetOneParams

} from '@shared/abstractClass';

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

    async transaction(transaction: (transactionManager: EntityManager) => Promise<void>, isolationLevel?: IsolationLevel)
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

    async restore(id: string, transactionManager?: EntityManager): Promise<T>
    {
        const entity: any = await this.repository.findOne({ withDeleted: true, where: { _id: id } as any });

        if (!entity)
        {
            throw new NotFoundCustomException(this.entityClass.name);
        }

        // eslint-disable-next-line no-unused-expressions
        transactionManager ? await transactionManager.restore(this.entityClass, id) : void await this.repository.restore(id);


        entity.deletedAt = null;

        return entity;
    }

    async delete({ id, softDelete = true, withDeleted = false }: IDeleteParams, transactionManager?: EntityManager): Promise<T>
    {
        const entity: any = await this.repository.findOne({ withDeleted, where: { _id: id } as any });

        if (!entity)
        {
            throw new NotFoundCustomException(this.entityClass.name);
        }

        if (softDelete)
        {
            // eslint-disable-next-line no-unused-expressions
            transactionManager ? await transactionManager.softDelete(this.entityClass, id) : void await this.repository.softDelete(id);
        }
        else
        {
            // eslint-disable-next-line no-unused-expressions
            transactionManager ? await transactionManager.delete(this.entityClass, id) : void await this.repository.delete(id);
        }

        entity.deletedAt = Date.now();

        return entity;
    }

    async getOne({ id, withDeleted = false }: IGetOneParams): Promise<T>
    {
        const entity = await this.repository.findOne({ withDeleted, where: { _id: id } as any });

        if (!entity)
        {
            throw new NotFoundCustomException(this.entityClass.name);
        }

        return entity;
    }

    async getOneBy({ condition, options = { initThrow: true }, withDeleted = false, relations = [] }: IGetOneByParams): Promise<T | null>
    {
        const { initThrow } = options;

        const entity = await this.repository.findOne({ withDeleted, where: condition as any, relations: relations as any });

        if (initThrow && !entity)
        {
            throw new NotFoundCustomException(this.entityClass.name);
        }

        return entity;
    }

    async getBy({ condition, options = { initThrow: false } }: IGetByParams): Promise<T[]>
    {
        const { initThrow } = options;

        const entities = await this.repository.findBy(condition as any);

        if (initThrow && !entities.length)
        {
            throw new NotFoundCustomException(this.entityClass.name);
        }

        return entities;
    }

    async exist<D = any>({ condition, select, initThrow = false, withDeleted = false }: IExistParams): Promise<D>
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

