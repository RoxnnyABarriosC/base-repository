import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions_key';
export const RequirePermissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, permissions);
