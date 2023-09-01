import { SkipLogging } from '@modules/common/logger/presentation/interceptors';
import { Controller, Get, Logger, Render, UseInterceptors } from '@nestjs/common';
import { NotInterceptResponse } from '@shared/interceptors';
import { toArrayOfPlainStringsOrJson } from 'log-parsed-json';
import * as fs from 'fs';

export const loggerTemplates = 'common/logger/presentation/views/';

@SkipLogging()
@Controller('logs')
@NotInterceptResponse()
export class LoggerController
{
    private readonly logger = new Logger(LoggerController.name);

    @Get()
    @Render(loggerTemplates.concat('index'))
    index()
    {
        const logContent = fs.readFileSync('.logs/trace.log', 'utf8');
        const logData = [];

        toArrayOfPlainStringsOrJson(logContent).map(log =>
        {
            try
            {
                logData.push(JSON.parse(log));
            }
            catch (e)
            {}
        });

        return { logData };
    }
}
