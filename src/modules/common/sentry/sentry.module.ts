import { sentryFactory } from '@modules/common/sentry/infrastructure/factories';
import { SentryInterceptorProvider } from '@modules/common/sentry/infrastructure/providers';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SentryModule as _SentryModule } from '@ntegral/nestjs-sentry';
import { validateEnv } from '@src/validate-env';

@Module({
    imports: [
        _SentryModule.forRootAsync({
            imports: [ConfigModule.forRoot({ validate: validateEnv })],
            inject: [ConfigService],
            useFactory: sentryFactory
        })
    ],
    providers: [SentryInterceptorProvider]
})
export class SentryModule
{}
