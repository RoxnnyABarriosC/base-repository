import { SetMetadata } from '@nestjs/common';

export const CACHE_NO_AUTH = 'cache_module:cache_no_auth';
export const CacheNoAuth = () => SetMetadata(CACHE_NO_AUTH, true);
