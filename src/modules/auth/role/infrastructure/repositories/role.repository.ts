import { Role } from '@modules/auth/role/domain/entities';
import {
    NotAllowedRemoveASystemRolException,
    NotFoundOrDisabledRoleException
} from '@modules/auth/role/domain/exceptions';
import { GetOneBySlugParamsInterface } from '@modules/auth/role/infrastructure/repositories/role-repository.interface';
import { RoleSchema } from '@modules/auth/role/infrastructure/schemas';
import { RoleFilters } from '@modules/auth/role/presentation/criterias';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository, DeleteParamsInterface } from '@shared/abstractClass';
import { CriteriaBuilder } from '@shared/criterias';
import { NotFoundCustomException } from '@shared/exceptions';
import { PgSqlFilter } from '@shared/helpers/pg-sql-filter.helper';
import { Paginator } from '@shared/pagination';
import { In, Repository } from 'typeorm';

@Injectable()
export class RoleRepository extends BaseRepository<Role>
{
    private readonly logger = new Logger(RoleRepository.name);

    constructor(@InjectRepository(RoleSchema) repository: Repository<Role>)
    {
        super(Role, repository);
    }

    async list(criteria: CriteriaBuilder)
    {
        const queryBuilder = this.repository.createQueryBuilder('i');

        const filter = new PgSqlFilter(criteria.getFilter<any>(), queryBuilder);

        queryBuilder.where('1 = 1');

        void await filter.partialRemoved(RoleFilters.WITH_PARTIAL_REMOVED);

        void filter.is(
            {
                attribute: RoleFilters.PARTIAL_REMOVED,
                isBoolean: true,
                dbAttribute: 'deletedAt'
            },
            'andWhere',
            'IS NOT NULL'
        );

        void filter.filter(
            {
                attribute: RoleFilters.ENABLE,
                isBoolean: true
            },
            'andWhere',
            '='
        );

        void filter.filter(
            {
                attribute: RoleFilters.OF_SYSTEM,
                isBoolean: true
            },
            'andWhere',
            '='
        );

        void filter.filterInArrayString(RoleFilters.PERMISSIONS, 'andWhere');
        void filter.filterInArrayString(RoleFilters.ALLOWED_VIEWS, 'andWhere');

        void (await filter.search(
            RoleFilters.SEARCH,
            {
                partialMatch: true,
                attributesDB: [
                    { name: 'name', setWeight: 'A' },
                    { name: 'slug', setWeight: 'A' }
                ]
            },
            'andWhere'
        ));

        return new Paginator(queryBuilder, criteria);
    }

    override async delete({
        id,
        softDelete = true,
        withDeleted = false
    }: DeleteParamsInterface): Promise<Role>
    {
        const isOfSystem = !!(await this.exist({
            condition: { _id: id, ofSystem: true },
            select: ['_id'],
            initThrow: false,
            withDeleted: true
        }));

        if (isOfSystem)
        {
            throw new NotAllowedRemoveASystemRolException();
        }

        const role = await this.repository.findOne({
            withDeleted,
            where: { _id: id } as any
        });

        if (!role)
        {
            throw new NotFoundCustomException(this.entityClass.name);
        }

        if (softDelete)
        {
            await this.repository.softDelete(id);
        }
        else
        {
            await this.repository.delete(id);
        }

        return role;
    }

    async getOneBySlug({
        slug,
        withDeleted = false,
        initThrow = true
    }: GetOneBySlugParamsInterface): Promise<Role>
    {
        const entity = await this.repository.findOne({
            withDeleted,
            where: { slug } as any
        });

        if (initThrow && !entity)
        {
            throw new NotFoundCustomException(this.entityClass.name);
        }

        return entity;
    }

    async getEnableRolesByIds(ids: string[])
    {
        const roles = await this.getBy({ condition: { _id: In(ids), enable: true } });

        if (roles.length < ids.length)
        {
            throw new NotFoundOrDisabledRoleException();
        }

        return roles;
    }
}
