import { Role } from '@modules/role/domain/entities';
import {
    NotFoundOrDisabledRoleException
} from '@modules/role/domain/exceptions';
import { RoleFilters } from '@modules/role/presentation/criterias';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundCustomException } from '@shared/app/exceptions';
import { CriteriaBuilder } from '@shared/criteria';
import { BaseRepository } from '@shared/typeOrm/abstractClass';
import { PgSqlFilterCriteria } from '@shared/typeOrm/helpers';
import { Paginator } from '@shared/typeOrm/pagination';
import { In, Repository } from 'typeorm';
import { RoleSchema } from '../schemas';
import { GetOneBySlugParamsInterface } from './role-repository.interface';

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

        const filter = new PgSqlFilterCriteria(criteria.getFilter<any>(), queryBuilder);

        queryBuilder.where('1 = 1');

        void await filter.partialRemoved(RoleFilters.WITH_PARTIAL_REMOVED);

        void filter.is(
            {
                attribute: RoleFilters.PARTIAL_REMOVED,
                isBoolean: true
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
