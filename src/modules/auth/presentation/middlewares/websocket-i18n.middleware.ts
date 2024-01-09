import { SocketMiddleware } from '@modules/auth/presentation/middlewares/websocket-auth.middleware';
import { ModuleRef } from '@nestjs/core';
import { I18N_OPTIONS, I18N_RESOLVERS, I18nContext, I18nOptionResolver, I18nOptions, I18nService } from 'nestjs-i18n';

export const WebSocketI18nMiddleware = (moduleRef: ModuleRef): SocketMiddleware =>
{
    // const getResolver = async(r: I18nOptionResolver): Promise<I18nResolver> =>
    // {
    //     if (shouldResolve(r))
    //     {
    //         if (r['use'])
    //         {
    //             const resolver = r as ResolverWithOptions;
    //             return moduleRef.get(resolver.use);
    //         }
    //         else
    //         {
    //             return moduleRef.get(r as Type<I18nResolver>);
    //         }
    //     }
    //     else
    //     {
    //         return r as I18nResolver;
    //     }
    // };

    return async(client, next) =>
    {
        try
        {
            const language = null;

            // Skip middleware if language is already resolved

            if ((client as any).i18nLang)
            {
                return next();
            }

            const i18nService = moduleRef.get(I18nService, { strict: false });
            const i18nOptions = moduleRef.get<I18nOptions>(I18N_OPTIONS, { strict: false });
            const i18nResolvers = moduleRef.get<I18nOptionResolver[]>(I18N_RESOLVERS, { strict: false });

            client.i18nService = i18nService;

            // for (const r of i18nResolvers)
            // {
            //     const resolver = await getResolver(r);
            //
            //     language = resolver.resolve(new MiddlewareHttpContext(req, res, next));
            //
            //     if (language instanceof Promise)
            //     {
            //         language = await (language as Promise<string>);
            //     }
            //
            //     if (language !== undefined)
            //     {
            //         break;
            //     }
            // }
            //

            client.i18nLang = language || i18nOptions.fallbackLanguage;

            client.i18nContext = new I18nContext(client.i18nLang, i18nService);

            if (!i18nOptions.skipAsyncHook)
            {
                I18nContext.create(client.i18nContext, next);

                return;
            }

            next();
        }
        catch (error)
        {
            next(error as any);
        }
    };
};
