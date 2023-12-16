import { CheckEmailDomain, CheckSuperAdmin, Protected } from '@modules/auth/presentation/decorators';
import { EmailDomainTypeEnum } from '@modules/user/domain/enums';
import { Controller, Get, Logger } from '@nestjs/common';
import { NotInterceptResponse, SkipCache } from '@shared/app/decorators';
import { Criteria, Pagination } from '@shared/criteria/decorators';
import { PaginationFilter } from '@shared/criteria/filters';
import { toArrayOfPlainStringsOrJson } from 'log-parsed-json';
import * as fs from 'fs';
import { SkipLogging } from '../interceptors';


@SkipCache()
@SkipLogging()
@Controller('logs')
@NotInterceptResponse()
@Protected()
@CheckSuperAdmin()
@CheckEmailDomain(EmailDomainTypeEnum.ADMIN)
export class LoggerController
{
    private readonly logger = new Logger(LoggerController.name);

    @Get()
    @Criteria()
    list(
        @Pagination() pagination: PaginationFilter
    )
    {
        const logContent = fs.readFileSync('.logs/trace.log', 'utf8');
        const _data = [];
        toArrayOfPlainStringsOrJson(logContent).map(log =>
        {
            try
            {
                _data.push((JSON.parse(log)));
            }
            catch (e)
            {}
        });

        let data = _data.reverse();

        if (pagination.limit && pagination.offset)
        {
            data = data.slice(+pagination.offset, +pagination.offset + +pagination.limit);
        }

        return { data, total: _data.length };
    }
}
