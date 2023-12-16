import { OtherPermissions, OtherPermissionsEnum } from '@modules/common/index/other.permissions';
import { RolePermissions, RolePermissionsEnum } from '@modules/role/role.permissions';
import { SecurityConfigPermissions, SecurityConfigPermissionsEnum } from '@modules/securityConfig/security-config.permissions';
import { UserPermissions, UserPermissionsEnum } from '@modules/user/user.permissions';
import { ALL_MANAGE_PERMISSION } from '@shared/app/constants';
import { AppPermissions } from '@shared/app/factories';

export const allPermissionsEnums = [
    {
        ALL_MANAGE: ALL_MANAGE_PERMISSION
    },
    OtherPermissionsEnum,
    UserPermissionsEnum,
    RolePermissionsEnum,
    SecurityConfigPermissionsEnum
];

export const AllAppPermissions =  AppPermissions(
    OtherPermissions.I,
    UserPermissions.I,
    RolePermissions.I,
    SecurityConfigPermissions.I
);

