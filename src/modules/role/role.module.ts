import { CommonModule } from '@modules/common';
import { RoleService } from '@modules/role/domain/services';
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
} from '@modules/role/domain/useCases';
import { RoleRepository } from '@modules/role/infrastructure/repositories';
import { RoleSchema } from '@modules/role/infrastructure/schemas';
import { RoleController } from '@modules/role/presentation/controllers';
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
