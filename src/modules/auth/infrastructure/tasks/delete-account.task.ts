import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class DeleteAccountTask
{
    private readonly logger = new Logger(DeleteAccountTask.name);

    constructor(
        private readonly repository: UserRepository,
        private readonly configService: ConfigService
    )
    { }

    @Cron(CronExpression.EVERY_DAY_AT_1AM)
    async handleDeleteAccount()
    {
        this.logger.log('Deleting accounts users');

        const domainsToExclude = this.configService.getOrThrow<string[]>('emailsDomain.admin');
        const days = this.configService.getOrThrow<number>('elapsedDaysToDeleteAUser');

        try
        {
            await this.repository.deleteAccounts(domainsToExclude, days);
        }
        catch (error)
        {
            this.logger.error('Error deleting inactive users', error);
        }
    }
}
