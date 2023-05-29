import { File } from '@modules/common/file/domain/entities';
import { FileSchema } from '@modules/common/file/infrastructure/schemas';
import { FileFilters } from '@modules/common/file/presentation/criterias';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '@shared/abstractClass';
import { CriteriaBuilder } from '@shared/criterias';
import { PgSqlFilter } from '@shared/helpers';
import { Paginator } from '@shared/pagination';
import { Repository } from 'typeorm';


@Injectable()
export class FileRepository extends BaseRepository<File>
{
    private readonly logger = new Logger(FileRepository.name);

    constructor(@InjectRepository(FileSchema) repository: Repository<File>)
    {
        super(File, repository);
    }

    async list(criteria: CriteriaBuilder)
    {
        const queryBuilder = this.repository.createQueryBuilder('i');

        const filter = new PgSqlFilter(criteria.getFilter<any>(), queryBuilder);

        queryBuilder.where('1 = 1');

        void (await filter.customFilter(async(fltr, qb) =>
        {
            if (fltr.has(FileFilters.WITH_PARTIAL_REMOVED))
            {
                const withDeleted = fltr.get<boolean>(FileFilters.WITH_PARTIAL_REMOVED);

                if (withDeleted)
                {
                    qb.withDeleted();
                }
            }
        }));

        void filter.is(
            {
                attribute: FileFilters.PARTIAL_REMOVED,
                isBoolean: true,
                dbAttribute: 'deletedAt'
            },
            'andWhere',
            'IS NOT NULL'
        );

        void filter.filter(
            {
                attribute: FileFilters.IS_PRIVATE,
                isBoolean: true
            },
            'andWhere',
            '='
        );

        void (await filter.search(
            FileFilters.SEARCH,
            {
                partialMatch: true,
                attributesDB: [
                    { name: 'name', setWeight: 'A' },
                    { name: 'originalName', setWeight: 'A' },
                    { name: 'mimeType', setWeight: 'A' },
                    { name: 'extension', setWeight: 'A' },
                    { name: 'contentType', setWeight: 'A' },
                    { name: 'path', setWeight: 'B' }
                ]
            },
            'andWhere'
        ));

        return new Paginator(queryBuilder, criteria);
    }
}
