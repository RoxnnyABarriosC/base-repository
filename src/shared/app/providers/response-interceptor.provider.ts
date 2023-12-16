import {
    Provider
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from '../interceptors';

export const ResponseInterceptorProvider: Provider = {
    provide: APP_INTERCEPTOR,
    useClass: ResponseInterceptor
};
