import { Permissions } from '@shared/app/factories';

export enum RolePermissionsEnum {
    MANAGE = 'role:manage',
    SAVE = 'role:save',
    UPDATE = 'role:update',
    SHOW = 'role:show',
    LIST = 'role:list',
    DELETE= 'role:delete',
    RESTORE = 'role:restore',
    UPDATE_ENABLE = 'role:update:enable',
    UPDATE_PERMISSIONS = 'role:update:permissions',
    UPDATE_ALLOWED_VIEWS = 'role:update:allowedViews',
    UPDATE_SCOPE_CONFIG = 'role:update:scopeConfig',
    SHOW_PERMISSIONS = 'role:show:permissions',
}

export class RolePermissions extends Permissions<RolePermissionsEnum>(RolePermissionsEnum, RolePermissionsEnum.MANAGE, 'ROLES')
{ }
