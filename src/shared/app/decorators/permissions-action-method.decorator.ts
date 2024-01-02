import { SetMetadata } from '@nestjs/common';

export type PermissionActions = 'some' | 'every'
export const PERMISSION_ACTION_METHOD_KEY = 'permission_action_method_key';
export const PermissionActionMethod = (action: PermissionActions) => SetMetadata(PERMISSION_ACTION_METHOD_KEY, action);
