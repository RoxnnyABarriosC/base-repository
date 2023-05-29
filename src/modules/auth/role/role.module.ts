import { RoleService } from '@modules/auth/role/domain/services';
import {
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
} from '@modules/auth/role/domain/useCases';
import { RoleRepository } from '@modules/auth/role/infrastructure/repositories';
import { RoleSchema } from '@modules/auth/role/infrastructure/schemas';
import { RoleController } from '@modules/auth/role/presentation/controllers';
import { CommonModule } from '@modules/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([RoleSchema]),
        CommonModule
    ],
    controllers: [
        RoleController
    ],
    providers: [
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
        UpdateScopeConfigRoleUseCase,
        RoleService,
        RoleRepository
    ],
    exports: [
        RoleService,
        RoleRepository
    ]
})
export class RoleModule
{}
