import { MiddlewareConfigProxy } from '@nestjs/common/interfaces';
import { ClassSerializerInterceptorOptions } from '@nestjs/common/serializer/class-serializer.interceptor';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export interface IUriConfig
{
    api: string;
    web: string;
}

export interface IServerConfig
{
    url: IUriConfig;
    prefix: string;
    version: string;
    port: number;
    whiteList: string;
}

export interface ILoggerConfig
{
    singleLine: boolean;
    colorize: boolean;
    exclude: Parameters<MiddlewareConfigProxy['exclude']>;
}

export interface ISentryConfig
{
    dsn: string;
    enable: boolean;
}

export declare type AppLocale = 'en' | 'es';

export interface IJwtConfig
{
    secret: string;
    expires: string;
    refreshExpires: string;
    confirmationExpires: string;
    iss: string;
    aud: string;
    algorithm: Algorithm;
    checkBlackList: boolean;
}

export interface IDBConfig extends  PostgresConnectionOptions {
    type: 'postgres';
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    synchronize: boolean;
    migrationsRun: boolean;
    logging: boolean;
    subscribers: string[];
    autoLoadEntities?: boolean;
}

export interface IPaginationConfig
{
    limit: number;
}

export interface IBCryptTypeConfig
{
    type: string;
    saltRounds: number;
    algorithm: any;
}

export interface IEncryptionConfig
{
    bcrypt: IBCryptTypeConfig;
    default: 'bcrypt' | 'md5';
}

export interface ICacheConfig
{
    socket: {
        host: string;
        port: number;
    };
    password: string;
}

type ISMTPConfig = {
    host: string;
    port: number;
    username: string;
    password: string;
    secure: boolean;
    senderName: string;
    emails: {
        default: string;
    }
};

export interface IS3Config
{
    host: string;
    exposeHost: string;
    exposeHttps: boolean;
    accessKey: string;
    secretKey: string;
    useSSL: boolean;
    port: number;
    publicBucket: string;
    privateBucket: string;
    rootPath: string;
    region: string;
    expire: number;
}

export interface ITasksConfig
{
    logger: {
        deleteTraceLog: string;
    },
    otp: {
        restartingAttempts: string;
    }
}

export interface IOTPConfig
{
    codeExpire: string;
    limitAttempts: number
}

export interface ITwilioConfig {
    accountSid: string;
    authToken: string;
    fromNumber: string;
}

export interface ConfigInterface {
    environment: string;
    server: IServerConfig;
    logger: ILoggerConfig;
    locale: AppLocale;
    sentry: ISentryConfig;
    jwt: IJwtConfig;
    setCookieSecure: boolean;
    setCookieSameSite: boolean | 'none' | 'lax' | 'strict';
    db: IDBConfig;
    pagination: IPaginationConfig;
    encryption: IEncryptionConfig;
    cache: ICacheConfig;
    smtp: ISMTPConfig;
    s3: IS3Config;
    serializer: Partial<ClassTransformOptions>
    tasks: ITasksConfig;
    otp: IOTPConfig;
    twilio: ITwilioConfig;
}
