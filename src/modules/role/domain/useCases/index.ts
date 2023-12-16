export * from './delete-role.useCase';
export * from './enable-or-disable-role.useCase';
export * from './get-permissions.useCase';
export * from './get-role.useCase';
export * from './list-roles.useCase';
export * from './restore-role.useCase';
export * from './save-role.useCase';
export * from './sync-roles-permissions.useCase';
export * from './update-allowed-views-role.useCase';
export * from './update-permissions-role.useCase';
export * from './update-role.useCase';
export * from './update-scope-config-role.useCase';
import * as _useCases  from './index';


export const useCases = [
    _useCases.DeleteRoleUseCase,
    _useCases.EnableOrDisableRoleUseCase,
    _useCases.GetPermissionsUseCase,
    _useCases.GetRoleUseCase,
    _useCases.ListRolesUseCase,
    _useCases.RestoreRoleUseCase,
    _useCases.SaveRoleUseCase,
    _useCases.SyncRolesPermissionsUseCase,
    _useCases.UpdateAllowedViewsRoleUseCase,
    _useCases.UpdatePermissionsRoleUseCase,
    _useCases.UpdateRoleUseCase,
    _useCases.UpdateScopeConfigRoleUseCase
];

