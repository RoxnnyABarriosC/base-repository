import { SetMetadata } from '@nestjs/common';

export const THROTTLE_USE_URL = 'throttle_use_url';
export const ThrottleUseUrl = () => SetMetadata(THROTTLE_USE_URL, true);
