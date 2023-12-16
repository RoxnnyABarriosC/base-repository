import { SetMetadata } from '@nestjs/common';

export const CHECK_SUPER_ADMIN = 'check_super_admin';
export const CheckSuperAdmin = () => SetMetadata(CHECK_SUPER_ADMIN, true);
