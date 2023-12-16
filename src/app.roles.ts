import { AdminRole, ModeratorRole } from '@modules/role/domain/roles';
import { RolePermissions } from '@modules/role/role.permissions';
import { UserPermissions } from '@modules/user/user.permissions';
import { AppRoles } from '@shared/app/factories';

export const AllAppRoles = AppRoles(() =>
{
    const admin = AdminRole.I;
    const moderator = ModeratorRole.I;

    admin.AllManage();
    moderator.Extends(
        RolePermissions.I.Manage().Get(),
        UserPermissions.I.Manage().Get()
    );

    return [admin, moderator];
});

