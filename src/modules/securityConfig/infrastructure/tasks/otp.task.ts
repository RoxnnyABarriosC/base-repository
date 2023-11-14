import configuration from '@config/configuration';
import { SecurityConfigRepository } from '@modules/securityConfig/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

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
