import { SetMetadata } from '@nestjs/common';

export const FORCE_CHECK_POLICY_KEY = 'force_check_policy_key';
export const ForceCheckPolicy = () => SetMetadata(FORCE_CHECK_POLICY_KEY, true);
