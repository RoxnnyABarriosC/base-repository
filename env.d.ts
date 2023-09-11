declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: string;
        URL_API: string;
        URL_WEB: string;
        PREFIX: string;
        PORT: number;
        VERSION: string;
        WHITE_LIST: string;

        LOGGER_COLORIZE: boolean;
        LOGGER_SINGLE_LINE: boolean;
        LOGGER_TASK_DELETE_TRACE_LOG: string;

        SENTRY_DSN: string;
        SENTRY_ENABLE: boolean;

        LOCALE: 'en' | 'es';

        JWT_SECRET: string;
        JWT_EXPIRES: string;
        JWT_CONFIRMATION_EXPIRES: string;
        JWT_REFRESH_EXPIRES: string;
        JWT_ISS: string;
        JWT_AUD: string;
        JWT_ALGORITHM: Algorithm;
        JWT_CHECK_BLACK_LIST: boolean;

        SET_COOKIE_SECURE: boolean;
        SET_COOKIE_SAME_SITE: boolean | 'none' | 'lax' | 'strict';

        DB_HOST: string;
        DB_PORT: number;
        DB_USER: string;
        DB_PASSWORD: string;
        DB_SYNCHRONIZE: boolean;
        DB_DATABASE: string;
        DB_TYPE: 'postgres';
        DB_LOGGING: boolean;
        PAGINATION_LIMIT: number;

        ENCRYPTION_DEFAULT: 'bcrypt' | 'md5';

        CACHE_HOST: string;
        CACHE_PORT: number;
        CACHE_PASSWORD: string;

        SMTP_HOST: string;
        SMTP_PORT: number;
        SMTP_USERNAME: string;
        SMTP_PASSWORD: string;
        SMTP_SECURE_SSL: boolean;
        SMTP_SENDER_NAME: string;
        SMTP_SENDER_EMAIL_DEFAULT: string;

        MINIO_HOST: string;
        MINIO_ACCESS_KEY: string;
        MINIO_SECRET_KEY: string;
        MINIO_USE_SSL: boolean;
        MINIO_PORT: number;
        MINIO_PUBLIC_BUCKET: string;
        MINIO_PRIVATE_BUCKET: string;
        MINIO_REGION: string;
        MINIO_ROOT_PATH: string;
        MINIO_SIGN_EXPIRE: number;
        MINIO_EXPOSE_HTTPS: boolean;
        MINIO_EXPOSE_HOST: string;
    }
}
