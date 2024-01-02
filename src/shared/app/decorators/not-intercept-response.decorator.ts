import { SetMetadata } from '@nestjs/common';

export const NOT_INTERCEPT_RESPONSE = 'not_intercept_response';
export const NotInterceptResponse = () => SetMetadata(NOT_INTERCEPT_RESPONSE, true);
