import { Provider } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SerializerInterceptor } from '../interceptors';

export const SerializerInterceptorProvider: Provider = {
    provide: APP_INTERCEPTOR,
    useClass: SerializerInterceptor
};
