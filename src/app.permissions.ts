import { OtherPermissions, OtherPermissionsEnum } from '@modules/common/index/other.permissions';
import { RolePermissions, RolePermissionsEnum } from '@modules/role/role.permissions';
import { SecurityConfigPermissions, SecurityConfigPermissionsEnum } from '@modules/securityConfig/security-config.permissions';
import { UserPermissions, UserPermissionsEnum } from '@modules/user/user.permissions';
import { ALL_MANAGE_PERMISSION, GroupPermissions } from '@shared/factories';

export const allPermissionsEnums = [
    {
        ALL_MANAGE: ALL_MANAGE_PERMISSION
    },
    OtherPermissionsEnum,
    UserPermissionsEnum,
    RolePermissionsEnum,
    SecurityConfigPermissionsEnum
];

export class AppPermissionsFactory
{
    private static permissionsInstance = [
        {
            Group(): GroupPermissions<any>
            {
                return {
                    group: 'APP',
                    permissions: [ALL_MANAGE_PERMISSION]
                };
            },
            Get(original?: boolean): string[]
            {
                return [ALL_MANAGE_PERMISSION];
            }
        },
        OtherPermissions.I,
        UserPermissions.I,
        RolePermissions.I,
        SecurityConfigPermissions.I
    ];

    static groupPermissions(): GroupPermissions<any>[]
    {
        return  this.permissionsInstance.reduce((prev, curr) => [...prev, curr.Group()], []);
    }

    static permissions(): string[]
    {
        return this.permissionsInstance.reduce((prev, curr) => [... new Set([...prev, ...curr.Get(true)])], []);
    }
}
