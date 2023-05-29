import { Provider } from '@nestjs/common';
import { APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { SerializerInterceptor } from '@shared/interceptors';

export const SerializerInterceptorProvider: Provider = {
    provide: APP_INTERCEPTOR,
    useClass: SerializerInterceptor
};
