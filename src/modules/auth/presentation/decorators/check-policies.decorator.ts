import { SetMetadata } from '@nestjs/common';
import { PolicyType } from '../guards';

export const CHECK_POLICIES_KEY = 'check_policies_key';
export const CheckPolicies = (...policies: PolicyType[]) => SetMetadata(CHECK_POLICIES_KEY, policies);

export const FORCE_CHECK_POLICY_KEY = 'force_check_policy_key';
export const ForceCheckPolicy = () => SetMetadata(FORCE_CHECK_POLICY_KEY, true);
