import { bool, cleanEnv, host, num, port, str, url } from 'envalid';

export function validateEnv(config: Record<string, any>): Record<string, any>
{
    const clean = cleanEnv(config, {
        NODE_ENV: str({
            choices: ['development', 'test', 'production', 'staging']
        }),
        PORT: port({ default: 3000 }),
        URL_API: url(),
        URL_WEB: url(),
        PREFIX: str(),
        VERSION: str(),
        WHITE_LIST: str(),

        LOGGER_COLORIZE: bool({ default: false }),
        LOGGER_SINGLE_LINE: bool({ default: true }),

        SENTRY_DSN: url({ default: undefined }),
        SENTRY_ENABLE: bool({ default: false }),

        LOCALE: str({ default: 'en', choices: ['en', 'es'] }),

        JWT_SECRET: str(),
        JWT_EXPIRES: str(),
        JWT_CONFIRMATION_EXPIRES: str(),
        JWT_REFRESH_EXPIRES: str(),
        JWT_ISS: str(),
        JWT_AUD: str(),
        JWT_CHECK_BLACK_LIST: bool(),

        DB_HOST: host(),
        DB_USER: str(),
        DB_DATABASE: str(),
        DB_PASSWORD: str(),
        DB_PORT: port(),
        DB_SYNCHRONIZE: bool(),
        DB_TYPE: str({
            choices: ['postgres']
        }),
        PAGINATION_LIMIT: num(),

        ENCRYPTION_DEFAULT: str({
            choices: ['bcrypt', 'md5']
        }),

        SMTP_HOST: str(),
        SMTP_PORT: num(),
        SMTP_USERNAME: str(),
        SMTP_PASSWORD: str(),
        SMTP_SECURE_SSL: bool(),
        SMTP_SENDER_NAME: str(),
        SMTP_SENDER_EMAIL_DEFAULT: str(),

        MINIO_EXPOSE_HOST: str({ default: undefined }),
        MINIO_EXPOSE_HTTPS: bool({ default: undefined }),
        MINIO_HOST: str(),
        MINIO_ACCESS_KEY: str(),
        MINIO_SECRET_KEY: str(),
        MINIO_USE_SSL: bool(),
        MINIO_PORT: port({ default: undefined }),
        MINIO_PUBLIC_BUCKET: str(),
        MINIO_PRIVATE_BUCKET: str(),
        MINIO_REGION: str(),
        MINIO_ROOT_PATH: str(),
        MINIO_SIGN_EXPIRE: num()
    });

    config = { ...config, ...clean };

    process.env = <any>{ ...process.env, ...config };

    return config;
}
