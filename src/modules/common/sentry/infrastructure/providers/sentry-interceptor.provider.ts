import { HttpException, Provider } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SentryInterceptor } from '@ntegral/nestjs-sentry';

export const SentryInterceptorProvider: Provider = {
    provide: APP_INTERCEPTOR,
    useValue: new SentryInterceptor({
        filters: [
            {
                type: HttpException,
                filter: (exception: HttpException) =>
                {
                    return exception.getStatus() >= 500;
                }
            }
        ]
    })
};
