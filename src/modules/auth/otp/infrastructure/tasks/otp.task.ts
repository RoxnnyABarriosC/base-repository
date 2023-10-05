import configuration from '@config/configuration';
import { OTPRepository } from '@modules/auth/otp/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

const otpTaskConfig = configuration().tasks.otp;

@Injectable()
export class OtpTask
{
    private readonly logger = new Logger(OtpTask.name);

    constructor(
        private readonly repository: OTPRepository
    )
    {
    }

    @Cron(otpTaskConfig.restartingAttempts)
    async handleRestartingAttempts()
    {
        this.logger.log('Restarting attempts');

        await  this.repository.restartingAttempts();
    }
}
