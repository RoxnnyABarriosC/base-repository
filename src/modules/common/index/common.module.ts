import { FileModule } from '@modules/common/file';
import { I18nModule } from '@modules/common/i18n';
import { UniqueService } from '@modules/common/index/infrastructure/services';
import { LoggerModule } from '@modules/common/logger';
import { MailModule } from '@modules/common/mail';
import { SentryModule } from '@modules/common/sentry';
import { StoreModule } from '@modules/common/store';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        LoggerModule,
        I18nModule,
        SentryModule,
        StoreModule,
        MailModule,
        FileModule
    ],
    providers: [UniqueService],
    exports: [UniqueService]
})
export class CommonModule
{}
