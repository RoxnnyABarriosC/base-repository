import configuration from '@config/configuration';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import fs from 'fs';

const loggerTaskConfig = configuration().tasks.logger;

@Injectable()
export class LoggerTask
{
    private readonly logger = new Logger(LoggerTask.name);

    @Cron(loggerTaskConfig.deleteTraceLog)
    deleteTraceLog()
    {
        this.logger.log('eliminating log trace');
        fs.writeFile('.logs/trace.log', '', (err) =>
        {
            if (err)
            {
                throw err;
            }
            this.logger.log('the file log trace has been reset');
        });
    }
}
