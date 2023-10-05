import { MiddlewareConfigProxy } from '@nestjs/common/interfaces';
import { ClassSerializerInterceptorOptions } from '@nestjs/common/serializer/class-serializer.interceptor';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export interface UriInterface {
    api: string;
    web: string;
}

export interface ServerInterface {
    url: UriInterface;
    prefix: string;
    version: string;
    port: number;
    whiteList: string;
}

export interface LoggerInterface {
    singleLine: boolean;
    colorize: boolean;
    exclude: Parameters<MiddlewareConfigProxy['exclude']>;
}

export interface SentryInterface {
    dsn: string;
    enable: boolean;
}

export declare type AppLocale = 'en' | 'es';

export interface JwtConfigInterface {
    secret: string;
    expires: string;
    refreshExpires: string;
    confirmationExpires: string;
    iss: string;
    aud: string;
    algorithm: Algorithm;
    checkBlackList: boolean;
}

export interface DBInterface extends  PostgresConnectionOptions {
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

export interface PaginationInterface {
    limit: number;
}

export interface BCryptTypeInterface {
    type: string;
    saltRounds: number;
    algorithm: any;
}

export interface EncryptionInterface {
    bcrypt: BCryptTypeInterface;
    default: 'bcrypt' | 'md5';
}

export interface CacheConfigInterface {
    socket: {
        host: string;
        port: number;
    };
    password: string;
}

type SMTPConfigInterface = {
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

export interface S3ConfigInterface {
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

export interface TasksInterfaces {
    logger: {
        deleteTraceLog: string;
    },
    otp: {
        restartingAttempts: string;
    }
}

export interface OTPInterface {
    codeExpire: string;
    limitAttempts: number
}

export interface TwilioInterface {
    accountSid: string;
    authToken: string;
    fromNumber: string;
}

export interface ConfigInterface {
    environment: string;
    server: ServerInterface;
    logger: LoggerInterface;
    locale: AppLocale;
    sentry: SentryInterface;
    jwt: JwtConfigInterface;
    setCookieSecure: boolean;
    setCookieSameSite: boolean | 'none' | 'lax' | 'strict';
    db: DBInterface;
    pagination: PaginationInterface;
    encryption: EncryptionInterface;
    cache: CacheConfigInterface;
    smtp: SMTPConfigInterface;
    s3: S3ConfigInterface;
    serializer: Partial<ClassTransformOptions>
    tasks: TasksInterfaces;
    otp: OTPInterface;
    twilio: TwilioInterface;
}
