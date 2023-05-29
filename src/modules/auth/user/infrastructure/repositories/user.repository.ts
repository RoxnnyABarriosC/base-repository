import { User } from '@modules/auth/user/domain/entities';
import { UserSchema } from '@modules/auth/user/infrastructure/schemas';
import { UserFilters } from '@modules/auth/user/presentation/criterias';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '@shared/abstractClass';
import { CriteriaBuilder } from '@shared/criterias';
import { NotFoundCustomException } from '@shared/exceptions';
import { PgSqlFilter } from '@shared/helpers/pg-sql-filter.helper';
import { Paginator } from '@shared/pagination';
import { Repository } from 'typeorm';
import type {
    GetOneByEmailOrPhoneParamsInterface,
    GetOneByUserNameParamsInterface
} from '@modules/auth/user/infrastructure/repositories';

@Injectable()
export class UserRepository extends BaseRepository<User>
{
    private readonly logger = new Logger(UserRepository.name);

    constructor(@InjectRepository(UserSchema) repository: Repository<User>)
    {
        super(User, repository);
    }

    async list(criteria: CriteriaBuilder)
    {
        const queryBuilder = this.repository.createQueryBuilder('i');

        const filter = new PgSqlFilter(criteria.getFilter<any>(), queryBuilder);

        void queryBuilder.where('1 = 1');

        void await filter.customFilter(async(fltr, qb) =>
        {
            if (fltr.has(UserFilters.WITH_PARTIAL_REMOVED))
            {
                const withDeleted = fltr.get<boolean>(UserFilters.WITH_PARTIAL_REMOVED);

                if (withDeleted)
                {
                    qb.withDeleted();
                }
            }
        });

        void filter.is({
            attribute: UserFilters.PARTIAL_REMOVED,
            isBoolean: true,
            dbAttribute: 'deletedAt'
        }, 'andWhere', 'IS NOT NULL');


        void filter.filter({
            attribute: UserFilters.ENABLE,
            isBoolean: true
        }, 'andWhere', '=');

        void filter.filter({
            attribute: UserFilters.VERIFY,
            isBoolean: true
        }, 'andWhere', '=');

        void filter.filter({
            attribute: UserFilters.IS_SUPER_ADMIN,
            isBoolean: true
        }, 'andWhere', '=');

        void await filter.search(UserFilters.SEARCH, {
            partialMatch: true,
            attributesDB: [
                { name: 'userName', setWeight: 'A' },
                { name: 'email', setWeight: 'A' },
                { name: 'phone', setWeight: 'A' },
                { name: 'firstName', setWeight: 'B' },
                { name: 'lastName', setWeight: 'B' },
                { name: 'birthday', setWeight: 'B' },
                { name: 'gender', setWeight: 'C' }
            ]
        }, 'andWhere');

        void queryBuilder.leftJoinAndSelect('i.roles', 'role');

        return new Paginator(queryBuilder, criteria);
    }

    async getOneByUserName({ userName, withDeleted = false, initThrow = false }: GetOneByUserNameParamsInterface): Promise<User>
    {
        const user = await this.repository.findOne({ withDeleted, where: { userName } as any });

        if (initThrow && !user)
        {
            throw new NotFoundCustomException(this.entityClass.name);
        }

        return user;
    }

    async findOneByEmailOrPhone({ emailOrPhone, initThrow = false }: GetOneByEmailOrPhoneParamsInterface): Promise<User>
    {
        const user = await this.repository.findOne({ where: [{ email: emailOrPhone }, { phone: emailOrPhone }] });

        if (initThrow && !user)
        {
            throw new NotFoundCustomException(this.entityClass.name);
        }

        return user;
    }

    async setFalseFirstLogin(id: string)
    {
        await this.repository.update({ _id: id } as any, { firstLogin: false });
    }
}
