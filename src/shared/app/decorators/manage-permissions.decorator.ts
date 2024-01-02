import { SetMetadata } from '@nestjs/common';

export const MANAGE_PERMISSIONS_KEY = 'manage_permissions_key';
export const ManagePermissions = (...permissions: string[]) => SetMetadata(MANAGE_PERMISSIONS_KEY, permissions);
