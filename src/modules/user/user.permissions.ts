import { Permissions } from '@shared/app/factories';

export enum UserPermissionsEnum {
    MANAGE = 'user:manage',
    SAVE = 'user:save',
    UPDATE = 'user:update',
    BLOCK = 'user:block',
    SHOW = 'user:show',
    LIST = 'user:list',
    DELETE = 'user:delete',
    RESTORE = 'user:restore',
    UPDATE_ENABLE = 'user:update:enable',
    UPDATE_VERIFY = 'user:update:verify',
    UPDATE_PERMISSIONS = 'user:update:permissions',
    RESET_PASSWORD = 'user:reset:password'
}

export class UserPermissions extends Permissions<UserPermissionsEnum>(UserPermissionsEnum, UserPermissionsEnum.MANAGE, 'USERS')
{ }
