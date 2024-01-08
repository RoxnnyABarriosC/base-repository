import { StringToArray } from '@shared/utils';
import { bool, cleanEnv, host, makeValidator, num, port, str, url } from 'envalid';


const srtToArray = makeValidator((input: string) =>
{
    return StringToArray(input, ',');
});


export const validateEnv =  (config: Record<string, any>): Record<string, any> =>
{
    const clean = cleanEnv(config, {
        NODE_ENV: str({
            choices: ['development', 'test', 'production', 'staging']
        }),
        PROJECT_NAME: str({ default: 'base_repository' }),
        PORT: port({ default: 3000 }),
        URL_API: url({ default:'http://api.localhost' }),
        URL_WEB: url({ default: 'http://app.localhost' }),
        PREFIX: str({ default: '/api' }),
        VERSION: str({ default: '/v1' }),
        WHITE_LIST: srtToArray({
            default: ['api.localhost', 'http://mail.localhost/'],
            example: 'http://localhost:3000,http://localhost:3001'
        }),

        LOGGER_COLORIZE: bool({ default: true }),
        LOGGER_SINGLE_LINE: bool({ default: false }),
        LOGGER_TASK_DELETE_TRACE_LOG: str({ default: '*/30 * * * *' }),

        SENTRY_DSN: url({ default: undefined }),
        SENTRY_ENABLE: bool({ default: false }),

        LOCALE: str({ default: 'en', choices: ['en', 'es'] }),

        SET_COOKIE_SECURE: bool({ default: false }),
        SET_COOKIE_SAME_SITE: str({
            default: 'none', choices: ['none', 'strict', 'lax']
        }),

        JWT_SECRET: str(),
        JWT_EXPIRES: str({ default: '8h' }),
        JWT_CONFIRMATION_EXPIRES: str({ default: '1d' }),
        JWT_REFRESH_EXPIRES: str({ default: '1d' }),
        JWT_ISS: str(),
        JWT_AUD: str(),
        JWT_ALGORITHM: str({ default: 'HS512' }),
        JWT_CHECK_BLACK_LIST: bool({ default: false }),

        DB_HOST: host(),
        DB_USER: str(),
        DB_DATABASE: str(),
        DB_PASSWORD: str(),
        DB_PORT: port({ default: 5432 }),
        DB_SYNCHRONIZE: bool({ default: false }),
        DB_TYPE: str({
            default: 'postgres', choices: ['postgres']
        }),
        DB_LOGGING: bool({ default: true }),

        PAGINATION_LIMIT: num({ default: 10 }),

        ENCRYPTION_DEFAULT: str({
            default: 'bcrypt', choices: ['bcrypt', 'md5']
        }),

        CACHE_HOST: str({ default: 'redis' }),
        CACHE_PORT: num({ default: 6379 }),
        CACHE_PASSWORD: str(),

        SMTP_HOST: str(),
        SMTP_PORT: num(),
        SMTP_USERNAME: str(),
        SMTP_PASSWORD: str(),
        SMTP_SECURE_SSL: bool(),
        SMTP_SENDER_NAME: str(),
        SMTP_SENDER_EMAIL_DEFAULT: str(),

        MINIO_HOST: str(),
        MINIO_ACCESS_KEY: str(),
        MINIO_SECRET_KEY: str(),
        MINIO_USE_SSL: bool(),
        MINIO_PORT: port({ default: undefined }),
        MINIO_PUBLIC_BUCKET: str(),
        MINIO_PRIVATE_BUCKET: str(),
        MINIO_REGION: str(),
        MINIO_ROOT_PATH: str(),
        MINIO_SIGN_EXPIRE: num({ default: 9000 }),

        OTP_LIMIT_ATTEMPTS: num({ default: 50 }),
        OTP_TASK_RESTARTING_ATTEMPTS: str({ default: '0 0 * * *' }),
        OTP_CODE_LENGTH: num({ default: 6 }),

        TWILIO_ACCOUNT_SID: str(),
        TWILIO_AUTH_TOKEN: str(),
        TWILIO_FROM_NUMBER: str(),
        TWILIO_OTP_SERVICE_SID: str(),

        SENDGRID_TEMPLATE_PUBLIC_OTP_ID: str(),
        SENDGRID_TEMPLATE_OTP_ID: str(),

        FB_OAUTH_ID: str(),
        FB_OAUTH_SECRET: str(),
        FB_OAUTH_CALLBACK: url(),

        GO_OAUTH_ID: str(),
        GO_OAUTH_SECRET: str(),
        GO_OAUTH_CALLBACK: url(),

        AP_OAUTH_ID: str(),
        AP_OAUTH_SECRET: str(),
        AP_OAUTH_CALLBACK: url(),

        DOMAINS_ALLOWED_FOR_ADMINISTRATOR_EMAILS: srtToArray({
            example: 'example.com,example2.com',
            default: ['d2d.com', 'dare2dream.com', 'baserepository.com']
        }),

        ELAPSED_DAYS_TO_DELETE_A_USER: num({ default:30 }),

        TEMPORAL_BLOCK_TIME: num({ default: 30 }),
        TEMPORAL_BLOCK_AUTH_ATTEMPTS: num({ default: 3 })
    });

    config = { ...config, ...clean };

    process.env = <any>{ ...process.env, ...config };

    return config;
};
