import { AdminRole, ModeratorRole } from '@modules/auth/role/domain/roles';
import { RolePermissions } from '@modules/auth/role/role.permissions';
import { UserPermissions } from '@modules/auth/user/user.permissions';

export class AppRolesFactory
{
    static getRoles()
    {
        const admin = AdminRole.I;
        const moderator = ModeratorRole.I;

        admin.AllManage();
        moderator.Extends(
            RolePermissions.I.Manage().Get(),
            UserPermissions.I.Manage().Get()
        );

        return [admin, moderator];
    }
}

