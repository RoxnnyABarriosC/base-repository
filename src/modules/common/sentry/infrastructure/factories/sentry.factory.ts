import { ConfigService } from '@nestjs/config';
import { SentryModuleOptions } from '@ntegral/nestjs-sentry';

export const sentryFactory = async(configService: ConfigService): Promise<SentryModuleOptions> =>
{
    return {
        dsn: configService.getOrThrow('sentry.dsn'),
        enabled: configService.getOrThrow('sentry.enable'),
        environment: configService.getOrThrow('environment')
    };
};
