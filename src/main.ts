import compression from '@fastify/compress';
import fastifyCookie from '@fastify/cookie';
import { Logger as NestLogger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import {
    FastifyAdapter,
    NestFastifyApplication
} from '@nestjs/platform-fastify';
import { CustomExceptionsFilter } from '@shared/app/filters';
import { onRequestHook } from '@shared/app/hooks';
import { UserAgentMiddleware } from '@shared/app/middlewares';
import { ValidationPipe } from '@shared/classValidator/pipes';
import { LoggerContext } from '@shared/enums/logger-context';
import { handlebars } from '@shared/utils';
import { IServerConfig } from '@src/config';
import cookieParser from 'cookie-parser';
import { fastify } from 'fastify';
import { contentParser } from 'fastify-file-interceptor';
import qs from 'fastify-qs';
import hpropagate from 'hpropagate';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { join } from 'path';
import { AppModule } from './app.module';

declare const module: any;

void (async(): Promise<void> =>
{
    hpropagate({
        propagateInResponses: true
    });

    const fastifyInstance =  fastify();

    fastifyInstance.addHook('onRequest', onRequestHook);

    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(fastifyInstance),
        {
            cors: false,
            bufferLogs: true,
            autoFlushLogs: true
        }
    );

    try
    {
        app.useLogger(app.get(Logger));
        app.useGlobalInterceptors(new LoggerErrorInterceptor());
        app.useGlobalFilters(new CustomExceptionsFilter(app.get(HttpAdapterHost)));

        app.useStaticAssets({
            root: join(__dirname, '..', 'public'),
            prefix: '/public/'
        });

        app.setViewEngine({
            engine: {
                handlebars
            },
            templates: join(__dirname, 'modules')
        });

        app.useGlobalPipes(ValidationPipe());
        await app.register(compression);
        await app.register(fastifyCookie, { parseOptions: { httpOnly: true } });
        await app.register(contentParser);

        app.use(cookieParser());
        app.use(new UserAgentMiddleware().use);
        await app.register(qs);

        const { port, prefix, url, version, whiteList } = app
            .get<ConfigService>(ConfigService)
            .get<IServerConfig>('server');

        const _whiteList = whiteList.filter(u => u.length);
        _whiteList.push(url.web);

        // TODO: activar esto a futuro para aumentar la seguridad
        // await app.register(fastifyHelmet, {
        //     crossOriginEmbedderPolicy: false, // desactivar la política COEP predeterminada\
        //     contentSecurityPolicy: false
        // });

        app.enableCors({
            origin(origin, callback)
            {
                if (!origin || _whiteList.indexOf(origin) !== -1)
                {
                    callback(null, true);
                }
                else
                {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            credentials: true
        });

        app.enableVersioning({
            type: VersioningType.URI
        });

        app.setGlobalPrefix(prefix);

        await app.listen(port, '0.0.0.0');

        NestLogger.log(
            `Application is running on: ${await app.getUrl()}`,
            LoggerContext.BOOTSTRAP
        );
    }
    catch (error)
    {
        NestLogger.error(error, LoggerContext.BOOTSTRAP);
    }

    if (module.hot)
    {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }

    // eslint-disable-next-line no-undef
    async function closeGracefully(signal: NodeJS.Signals)
    {
        await app.close();
        process.kill(process.pid, signal);
    }

    process.once('SIGINT', closeGracefully);
    process.once('SIGTERM', closeGracefully);
    process.once('SIGUSR2', closeGracefully);
})();
