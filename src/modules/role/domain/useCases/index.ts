import { DeleteRoleUseCase } from './delete-role.useCase';
import { EnableOrDisableRoleUseCase } from './enable-or-disable-role.useCase';
import { GetPermissionsUseCase } from './get-permissions.useCase';
import { GetRoleUseCase } from './get-role.useCase';
import { ListRolesUseCase } from './list-roles.useCase';
import { RestoreRoleUseCase } from './restore-role.useCase';
import { SaveRoleUseCase } from './save-role.useCase';
import { SyncRolesPermissionsUseCase } from './sync-roles-permissions.useCase';
import { UpdateAllowedViewsRoleUseCase } from './update-allowed-views-role.useCase';
import { UpdatePermissionsRoleUseCase } from './update-permissions-role.useCase';
import { UpdateRoleUseCase } from './update-role.useCase';
import { UpdateScopeConfigRoleUseCase } from './update-scope-config-role.useCase';

const useCases = [
    DeleteRoleUseCase,
    EnableOrDisableRoleUseCase,
    GetPermissionsUseCase,
    GetRoleUseCase,
    ListRolesUseCase,
    RestoreRoleUseCase,
    SaveRoleUseCase,
    SyncRolesPermissionsUseCase,
    UpdateAllowedViewsRoleUseCase,
    UpdatePermissionsRoleUseCase,
    UpdateRoleUseCase,
    UpdateScopeConfigRoleUseCase
];

export {
    DeleteRoleUseCase,
    EnableOrDisableRoleUseCase,
    GetPermissionsUseCase,
    GetRoleUseCase,
    ListRolesUseCase,
    RestoreRoleUseCase,
    SaveRoleUseCase,
    SyncRolesPermissionsUseCase,
    UpdateAllowedViewsRoleUseCase,
    UpdatePermissionsRoleUseCase,
    UpdateRoleUseCase,
    UpdateScopeConfigRoleUseCase
};

export default useCases;
