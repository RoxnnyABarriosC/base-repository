declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: string;
        URL_API: string;
        URL_WEB: string;
        PREFIX: string;
        PORT: number;
        VERSION: string;
        WHITE_LIST: string[];

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
        DB_USE_SSL: boolean;
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

        STORAGE_TYPE: 's3' | 'blob';
        STORAGE_HOST: string;
        STORAGE_ACCESS_KEY: string;
        STORAGE_SECRET_KEY: string;
        STORAGE_USE_SSL: boolean;
        STORAGE_PORT: number;
        STORAGE_PUBLIC: string;
        STORAGE_PRIVATE: string;
        STORAGE_REGION: string;
        STORAGE_ROOT_PATH: string;
        STORAGE_SIGN_EXPIRE: number;

        OTP_LIMIT_ATTEMPTS: number;
        OTP_TASK_RESTARTING_ATTEMPTS: string;
        OTP_CODE_LENGTH: number;

        TWILIO_ACCOUNT_SID: string;
        TWILIO_AUTH_TOKEN: string;
        TWILIO_FROM_NUMBER: string;
        TWILIO_OTP_SERVICE_SID: string;

        SENDGRID_TEMPLATE_PUBLIC_OTP_ID: string;
        SENDGRID_TEMPLATE_OTP_ID: string;

        FB_OAUTH_ID: string;
        FB_OAUTH_SECRET: string;
        FB_OAUTH_CALLBACK: string;

        GO_OAUTH_ID: string;
        GO_OAUTH_SECRET: string;
        GO_OAUTH_CALLBACK: string;

        AP_OAUTH_ID: string;
        AP_OAUTH_SECRET: string;
        AP_OAUTH_CALLBACK: string;

        DOMAINS_ALLOWED_FOR_ADMINISTRATOR_EMAILS: string[];

        ELAPSED_DAYS_TO_DELETE_A_USER: number;

        TEMPORAL_BLOCK_TIME: number;
        TEMPORAL_BLOCK_AUTH_ATTEMPTS: number;
    }
}
