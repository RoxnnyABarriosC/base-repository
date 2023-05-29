import configuration from '@config/configuration';
import { AuthModule } from '@modules/auth';
import { CommonModule } from '@modules/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheInterceptor } from '@shared/interceptors';
import {
    ResponseInterceptorProvider,
    SerializerInterceptorProvider
} from '@shared/providers';
import { CacheConfigInterface } from '@src/config';
import { validateEnv } from '@src/validate-env';
import redisStore from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';
import { DataSource } from 'typeorm';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
            isGlobal: true,
            cache: true,
            validate: validateEnv
        }),
        CacheModule.registerAsync<RedisClientOptions>({
            inject: [ConfigService],
            isGlobal: true,
            useFactory: (config: ConfigService) => ({
                store: redisStore as unknown as CacheStore,
                ...config.get<CacheConfigInterface>('cache')
            })
        }),
        EventEmitterModule.forRoot({ global: true }),
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 100
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) =>
            {
                return {
                    ...config.get('db')
                };
            }
        }),
        ScheduleModule.forRoot(),
        HttpModule,
        CommonModule,
        AuthModule
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: CacheInterceptor
        },
        SerializerInterceptorProvider,
        ResponseInterceptorProvider
    ]
})
export class AppModule
{}
