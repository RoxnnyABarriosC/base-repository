import configuration from '@config/configuration';
import { AuthModule } from '@modules/auth';
import { CommonModule } from '@modules/common';
import { SocketModule } from '@modules/socket';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard } from '@shared/app/guards';
import { CacheInterceptor } from '@shared/app/interceptors';
import { ResponseInterceptorProvider } from '@shared/app/providers';
import { ValidationGuard } from '@shared/classValidator/guards';
import { SerializerInterceptorProvider } from '@shared/classValidator/providers';
import { GetMilliseconds } from '@shared/utils';
import { ICacheConfig } from '@src/config';
import { validateEnv } from '@src/validate-env';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
            isGlobal: true,
            cache: true,
            validate: validateEnv
        }),
        CacheModule.registerAsync({
            inject: [ConfigService],
            isGlobal: true,
            useFactory: (config: ConfigService) => ({
                store: redisStore,
                ...config.getOrThrow<ICacheConfig>('cache')
            })
        }),
        ScheduleModule.forRoot(),
        EventEmitterModule.forRoot({ global: true }),
        ThrottlerModule.forRoot({
            ttl: GetMilliseconds('1m'),
            limit: 1000
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => config.getOrThrow('db')
        }),
        HttpModule,
        CommonModule,
        AuthModule,
        SocketModule
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        },
        {
            provide: APP_GUARD,
            useClass: ValidationGuard
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: CacheInterceptor
        },
        ResponseInterceptorProvider,
        SerializerInterceptorProvider
    ]
})
export class AppModule
{}
