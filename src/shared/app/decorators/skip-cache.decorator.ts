import { SetMetadata } from '@nestjs/common';

export const SKIP_CACHE = 'skip_cache';
export const SkipCache = () => SetMetadata(SKIP_CACHE, true);
