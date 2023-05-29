import { SetMetadata } from '@nestjs/common';
import { PolicyType } from '../guards/protected.guard';

export const CHECK_POLICIES_KEY = 'check_policies_key';
export const CheckPolicies = (...policies: PolicyType[]) => SetMetadata(CHECK_POLICIES_KEY, policies);
