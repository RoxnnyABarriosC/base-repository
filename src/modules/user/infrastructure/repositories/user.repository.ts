import { User } from '@modules/user/domain/entities';
import { UserToDeleteView } from '@modules/user/infrastructure/views';
import { UserFilters } from '@modules/user/presentation/criterias';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundCustomException } from '@shared/app/exceptions';
import { CriteriaBuilder } from '@shared/criteria';
import { BaseRepository } from '@shared/typeOrm/abstractClass';
import { PgSqlFilterCriteria } from '@shared/typeOrm/helpers';
import { Paginator } from '@shared/typeOrm/pagination';
import { Repository } from 'typeorm';
import { UserSchema } from '../schemas';
import type {
    GetOneByEmailOrPhoneParamsInterface,
    GetOneByUserNameParamsInterface
} from './user-repository.interface';

@Injectable()
export class UserRepository extends BaseRepository<User>
{
    private readonly logger = new Logger(UserRepository.name);

    constructor(
      @InjectRepository(UserSchema) repository: Repository<User>,
      @InjectRepository(UserToDeleteView) private readonly userToDeleteRepository: Repository<UserToDeleteView>
    )
    {
        super(User, repository);
    }

    async list(criteria: CriteriaBuilder)
    {
        const queryBuilder = this.repository.createQueryBuilder('i');

        const filter = new PgSqlFilterCriteria(criteria.getFilter<any>(), queryBuilder);

        void queryBuilder.where('1 = 1');

        void await filter.partialRemoved(UserFilters.WITH_PARTIAL_REMOVED);

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
                { name: 'userNameId', setWeight: 'A' },
                { name: 'email', setWeight: 'A' },
                { name: 'firstName', setWeight: 'B' },
                { name: 'lastName', setWeight: 'B' },
                { name: 'phone', setWeight: 'A', coalesce: true },
                { name: 'birthday', setWeight: 'B', coalesce: true },
                { name: 'gender', setWeight: 'C', coalesce:true }
            ]
        }, 'andWhere');

        void queryBuilder.leftJoinAndSelect('i.roles', 'role');

        return new Paginator(queryBuilder, criteria);
    }

    async getOneByUserName({ userName, withDeleted = false, initThrow = false }: GetOneByUserNameParamsInterface): Promise<User>
    {
        const [username, userNameId] = userName.split('#');

        const user = await this.repository.findOne({ withDeleted, where: { userName: username, userNameId } as any });

        if (initThrow && !user)
        {
            throw new NotFoundCustomException(this.entityClass.name);
        }

        return user;
    }

    async findOneByEmailOrPhone({ emailOrPhone, initThrow = false, withDeleted = false }: GetOneByEmailOrPhoneParamsInterface): Promise<User>
    {
        const user = await this.repository.findOne({ where: [{ email: emailOrPhone }, { phone: emailOrPhone }], withDeleted });

        if (initThrow && !user)
        {
            throw new NotFoundCustomException(this.entityClass.name);
        }

        return user;
    }

    async findOneByEmailOrPhoneAndSelect({ emailOrPhone, initThrow = false }: GetOneByEmailOrPhoneParamsInterface): Promise<User>
    {
        const user = await this.repository.findOne({ where: [{ email: emailOrPhone }, { phone: emailOrPhone }], select: {
            phone: true,
            email: true
        } });

        if (initThrow && !user)
        {
            throw new NotFoundCustomException(this.entityClass.name);
        }

        return user;
    }

    async setFalseFirstLogin(id: string)
    {
        await this.repository.update({ _id: id } as any, { onBoarding: false });
    }

    async deleteAccounts(domains: string[], days: number)
    {
        const subQuery = this.userToDeleteRepository.createQueryBuilder()
            .select(['_id'])
            .where('domain NOT IN (:...domains)', { domains })
            .andWhere('days >= :days', { days }).getQuery();

        const queryBuilder = this.repository.createQueryBuilder()
            .delete()
            .where(`_id IN (${subQuery})`, { days, domains });

        await queryBuilder.execute();
    }

    async disable(id: string)
    {
        await this.repository.update({ _id: id } as any, { enable: false });
    }
}
