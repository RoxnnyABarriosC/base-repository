import { loggerFactory } from '@modules/common/logger/infrastructure/factories';
import { LoggerController } from '@modules/common/logger/presentation/controllers';
import { LoggerInterceptor } from '@modules/common/logger/presentation/interceptors';
import { CorrelationIdMiddleware } from '@modules/common/logger/presentation/middlewares';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { validateEnv } from '@src/validate-env';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Module({
    imports: [
        PinoLoggerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: loggerFactory
        })
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggerInterceptor
        }
    ],
    controllers: [LoggerController]
})
export class LoggerModule implements NestModule
{
    configure(consumer: MiddlewareConsumer)
    {
        consumer.apply(CorrelationIdMiddleware).forRoutes('*');
    }
}
