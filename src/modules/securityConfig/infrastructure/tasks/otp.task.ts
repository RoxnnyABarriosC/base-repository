import configuration from '@config/configuration';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SecurityConfigRepository } from '../repositories';

const otpTaskConfig = configuration().tasks.otp;

@Injectable()
export class OTPTask
{
    private readonly logger = new Logger(OTPTask.name);

    constructor(
        private readonly repository: SecurityConfigRepository
    )
    { }

    @Cron(otpTaskConfig.restartingAttempts)
    async handleRestartingAttempts()
    {
        this.logger.log('Restarting attempts');

        await  this.repository.restartingAttempts();
    }
}
