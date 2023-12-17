import { RequestMethod } from '@nestjs/common';
import dotenv from 'dotenv';
dotenv.config();
import { IConfig } from './config.interface';

export default (): IConfig => ({
    environment: process.env.NODE_ENV,
    server: {
        url: {
            api: process.env.URL_API,
            web: process.env.URL_WEB
        },
        whiteList: process.env.WHITE_LIST,
        prefix: process.env.PREFIX,
        port: process.env.PORT,
        version: process.env.VERSION
    },
    logger: {
        colorize: process.env.LOGGER_COLORIZE,
        singleLine: process.env.LOGGER_SINGLE_LINE,
        exclude: [{ method: RequestMethod.ALL, path: 'logs' }]
    },
    locale: process.env.LOCALE,
    sentry: {
        dsn: process.env.SENTRY_DSN,
        enable: process.env.SENTRY_ENABLE
    },
    jwt: {
        aud: process.env.JWT_AUD,
        iss: process.env.JWT_ISS,
        secret: process.env.JWT_SECRET,
        expires: process.env.JWT_EXPIRES,
        refreshExpires: process.env.JWT_REFRESH_EXPIRES,
        confirmationExpires: process.env.JWT_CONFIRMATION_EXPIRES,
        algorithm: process.env.JWT_ALGORITHM,
        checkBlackList: process.env.JWT_CHECK_BLACK_LIST
    },
    setCookieSecure: process.env.SET_COOKIE_SECURE,
    setCookieSameSite: process.env.SET_COOKIE_SAME_SITE,
    db: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        synchronize: process.env.DB_SYNCHRONIZE,
        database: process.env.DB_DATABASE,
        type: process.env.DB_TYPE,
        logging: process.env.DB_LOGGING,
        migrationsRun: false,
        autoLoadEntities: true,
        subscribers: [`${process.cwd()}/dist/modules/**/infrastructure/subscribers/*.subscriber{.ts,.js}`]
    },
    pagination: {
        limit: process.env.PAGINATION_LIMIT
    },
    encryption: {
        default: process.env.ENCRYPTION_DEFAULT,
        bcrypt: {
            type: 'bcrypt',
            saltRounds: 10,
            algorithm: 'HS512'
        }
    },
    cache: {
        socket: {
            host: process.env.CACHE_HOST,
            port: process.env.CACHE_PORT
        },
        password: process.env.CACHE_PASSWORD
    },
    smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        username: process.env.SMTP_USERNAME,
        password: process.env.SMTP_PASSWORD,
        senderName: process.env.SMTP_SENDER_NAME,
        emails: {
            default: process.env.SMTP_SENDER_EMAIL_DEFAULT
        },
        secure: process.env.SMTP_SECURE_SSL
    },
    s3: {
        host: process.env.MINIO_HOST,
        exposeHost: process.env.MINIO_EXPOSE_HOST,
        exposeHttps: process.env.MINIO_EXPOSE_HTTPS,
        accessKey: process.env.MINIO_ACCESS_KEY,
        secretKey: process.env.MINIO_SECRET_KEY,
        useSSL: process.env.MINIO_USE_SSL,
        port: process.env.MINIO_PORT,
        publicBucket: process.env.MINIO_PUBLIC_BUCKET,
        privateBucket: process.env.MINIO_PRIVATE_BUCKET,
        rootPath: process.env.MINIO_ROOT_PATH,
        region: process.env.MINIO_REGION,
        expire: process.env.MINIO_SIGN_EXPIRE
    },
    serializer: {
        excludePrefixes: ['_'],
        enableCircularCheck: true,
        excludeExtraneousValues: true,
        exposeDefaultValues: true
    },
    classValidator: {
        always: true,
        whitelist: true,
        strictGroups: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true
    },
    tasks: {
        logger: {
            deleteTraceLog: process.env.LOGGER_TASK_DELETE_TRACE_LOG
        },
        otp: {
            restartingAttempts: process.env.OTP_TASK_RESTARTING_ATTEMPTS
        }
    },
    otp: {
        limitAttempts: process.env.OTP_LIMIT_ATTEMPTS,
        codeLength: process.env.OTP_CODE_LENGTH
    },
    twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        fromNumber: process.env.TWILIO_FROM_NUMBER,
        otpServiceSid: process.env.TWILIO_OTP_SERVICE_SID
    },
    facebookStrategy: {
        clientID: process.env.FB_OAUTH_ID,
        clientSecret: process.env.FB_OAUTH_SECRET,
        callbackURL: process.env.FB_OAUTH_CALLBACK
    },
    googleStrategy: {
        clientID: process.env.GO_OAUTH_ID,
        clientSecret: process.env.GO_OAUTH_SECRET,
        callbackURL: process.env.GO_OAUTH_CALLBACK
    },
    appleStrategy: {
        clientID: process.env.GO_OAUTH_ID,
        keyID: process.env.GO_OAUTH_SECRET,
        callbackURL: process.env.GO_OAUTH_CALLBACK,
        teamID: null,
        privateKeyLocation: null
    },
    validatorProperties: {
        password: {
            min: 8,
            max: 24
        },
        firstName: {
            min: 3,
            max: 100
        },
        lastName: {
            min: 3,
            max: 100
        },
        birthday: {
            min: 18,
            max: 110
        },
        emailDomainLength: 3
    },
    emailsDomain: {
        admin: process.env.DOMAINS_ALLOWED_FOR_ADMINISTRATOR_EMAILS
    },
    sendgridTemplates: {
        otp: process.env.SENDGRID_TEMPLATE_OTP_ID,
        publicOTP: process.env.SENDGRID_TEMPLATE_PUBLIC_OTP_ID
    }
});
