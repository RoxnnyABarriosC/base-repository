import { ConfigService } from '@nestjs/config';
import { SentryModuleOptions } from '@ntegral/nestjs-sentry';

export const sentryFactory = async(configService: ConfigService): Promise<SentryModuleOptions> =>
{
    return {
        dsn: configService.get('sentry.dsn'),
        enabled: configService.get('sentry.enable'),
        environment: configService.get('environment')
    };
};
