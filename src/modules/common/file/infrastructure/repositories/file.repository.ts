import { File } from '@modules/common/file/domain/entities';
import { FileFilters } from '@modules/common/file/presentation/criterias';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CriteriaBuilder } from '@shared/criteria';
import { BaseRepository } from '@shared/typeOrm/abstractClass';
import { PgSqlFilterCriteria } from '@shared/typeOrm/helpers';
import { Paginator } from '@shared/typeOrm/pagination';
import { Repository } from 'typeorm';
import { FileSchema } from '../schemas';


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

        const filter = new PgSqlFilterCriteria(criteria.getFilter<any>(), queryBuilder);

        queryBuilder.where('1 = 1');

        void await filter.partialRemoved(FileFilters.WITH_PARTIAL_REMOVED);

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
