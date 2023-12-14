import { CheckPolicies, ForceCheckPolicy, ManagePermissions, Protected, RequirePermissions } from '@modules/auth/presentation/decorators';
import { CheckSuperAdmin } from '@modules/auth/presentation/guards';
import { SCOPE } from '@modules/role/domain/constants';
import { NotAllowedRemoveASystemRolPolicy, SystemRolCanNotBeModifiedPolicy } from '@modules/role/domain/policies';
import {
    DeleteRoleUseCase,
    EnableOrDisableRoleUseCase, GetPermissionsUseCase,
    GetRoleUseCase,
    ListRolesUseCase,
    RestoreRoleUseCase,
    SaveRoleUseCase, SyncRolesPermissionsUseCase,
    UpdateAllowedViewsRoleUseCase,
    UpdatePermissionsRoleUseCase,
    UpdateRoleUseCase,
    UpdateScopeConfigRoleUseCase
} from '@modules/role/domain/useCases';
import { RoleFilter, RoleSort } from '@modules/role/presentation/criterias';
import {
    AllowedViewsDto,
    PermissionsDto,
    SaveRoleDto,
    ScopeConfigDto,
    UpdateRoleDto
} from '@modules/role/presentation/dtos';
import { RoleSerializerGroupsEnum } from '@modules/role/presentation/enums';
import { RoleSerializer } from '@modules/role/presentation/serializers';
import { RolePermissionsEnum } from '@modules/role/role.permissions';
import { CacheTTL } from '@nestjs/cache-manager';
import {
    Body,
    Controller, Delete,
    Get,
    HttpCode,
    HttpStatus,
    Logger,
    Param, Patch,
    Post, Put
} from '@nestjs/common';
import { CriteriaBuilder, IUris, PaginationFilter } from '@shared/criterias';
import {
    Bool,
    Criteria,
    DeletePermanently,
    Filter,
    Pagination,
    PartialRemoved,
    SetSerializerGroups, Sort,
    UUID, Uris
} from '@shared/decorators';
import { ALL_MANAGE_PERMISSION } from '@shared/factories';
import { SetScopeSerializer } from '@shared/interceptors';
import { Serializer } from '@shared/utils';

@Controller({
    path: 'roles',
    version: '1'
})
@Protected()
@SetScopeSerializer(SCOPE)
@ManagePermissions(ALL_MANAGE_PERMISSION, RolePermissionsEnum.MANAGE)
export class RoleController
{
    private readonly logger = new Logger(RoleController.name);

    constructor(
        private readonly saveUseCase: SaveRoleUseCase,
        private readonly listUseCase: ListRolesUseCase,
        private readonly getUseCase: GetRoleUseCase,
        private readonly deleteUseCase: DeleteRoleUseCase,
        private readonly restoreUseCase: RestoreRoleUseCase,
        private readonly updateUseCase: UpdateRoleUseCase,
        private readonly enableOrDisableUseCase: EnableOrDisableRoleUseCase,
        private readonly updatePermissionsUseCase: UpdatePermissionsRoleUseCase,
        private readonly updateAllowedViewsUseCase: UpdateAllowedViewsRoleUseCase,
        private readonly updateScopeConfigUseCase: UpdateScopeConfigRoleUseCase,
        private readonly getPermissionsUseCase: GetPermissionsUseCase,
        private readonly syncRolesPermissionsUseCase: SyncRolesPermissionsUseCase
    )
    {}

    @Get('permissions')
    @HttpCode(HttpStatus.OK)
    @CacheTTL(60)
    @RequirePermissions(RolePermissionsEnum.SHOW_PERMISSIONS)
    async getPermissions()
    {
        this.logger.log('Processing get permissions request...');
        return await this.getPermissionsUseCase.handle();
    }

    @Put('sync')
    @HttpCode(HttpStatus.OK)
    @CheckSuperAdmin()
    async syncRolesPermissions()
    {
        this.logger.log('Processing sync roles permissions request...');
        return await this.syncRolesPermissionsUseCase.handle();
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @SetSerializerGroups(
        RoleSerializerGroupsEnum.ALL
    )
    @RequirePermissions(RolePermissionsEnum.SAVE)
    async save(
        @Body() dto: SaveRoleDto
    )
    {
        this.logger.log('Processing save role request...');
        return (await Serializer(await this.saveUseCase.handle({ dto }), RoleSerializer)) as typeof RoleSerializer;
    }

    @Get()
    @Criteria()
    @HttpCode(HttpStatus.OK)
    @RequirePermissions(RolePermissionsEnum.LIST)
    async list(
        @Filter() filters: RoleFilter,
        @Sort() sorts: RoleSort,
        @Pagination() pagination: PaginationFilter,
        @Uris() uris: IUris
    )
    {
        this.logger.log('Processing list roles request...');

        const criteria = new CriteriaBuilder({
            filters,
            sorts,
            pagination,
            uris
        });

        const data = await this.listUseCase.handle({ criteria });

        return (await Serializer(data, RoleSerializer)) as typeof RoleSerializer[];
    }

    @Get(':slug')
    @HttpCode(HttpStatus.OK)
    @RequirePermissions(RolePermissionsEnum.SHOW)
    @SetSerializerGroups(
        RoleSerializerGroupsEnum.ALL
    )
    async get(
        @Param('slug') slug: string,
        @PartialRemoved() partialRemoved: boolean
    )
    {
        this.logger.log('Processing get role request...');
        return (await Serializer(await this.getUseCase.handle({
            slug,
            partialRemoved
        }), RoleSerializer)) as typeof RoleSerializer;
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @RequirePermissions(RolePermissionsEnum.DELETE)
    @CheckPolicies(NotAllowedRemoveASystemRolPolicy)
    @ForceCheckPolicy()
    async delete(
        @UUID() id: string,
        @DeletePermanently() deletePermanently?: boolean
    )
    {
        this.logger.log('Processing delete role request...');

        return (await Serializer(await this.deleteUseCase.handle({
            id,
            deletePermanently
        }), RoleSerializer)) as typeof RoleSerializer;
    }

    @Patch(':id/restore')
    @HttpCode(HttpStatus.OK)
    @RequirePermissions(RolePermissionsEnum.RESTORE)
    async restore(
        @UUID() id: string
    )
    {
        this.logger.log('Processing restore role request...');

        return (await Serializer(await this.restoreUseCase.handle({
            id
        }), RoleSerializer)) as typeof RoleSerializer;
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @RequirePermissions(RolePermissionsEnum.UPDATE)
    @SetSerializerGroups(
        RoleSerializerGroupsEnum.ALL
    )
    @CheckPolicies(SystemRolCanNotBeModifiedPolicy)
    @ForceCheckPolicy()
    async update(
        @UUID() id: string,
        @Body() dto: UpdateRoleDto
    )
    {
        this.logger.log('Processing update role request...');

        return (await Serializer(await this.updateUseCase.handle({
            id, dto
        }), RoleSerializer)) as typeof RoleSerializer;
    }

    @Patch(':id/enable-or-disable/:enable')
    @HttpCode(HttpStatus.OK)
    @RequirePermissions(RolePermissionsEnum.UPDATE_ENABLE)
    @CheckPolicies(SystemRolCanNotBeModifiedPolicy)
    @ForceCheckPolicy()
    async enableOrDisable(
        @UUID() id: string,
        @Bool() enable: boolean
    )
    {
        this.logger.log('Processing enable or disable role request...');
        return await this.enableOrDisableUseCase.handle({ id, enable });
    }

    @Patch(':id/permissions')
    @HttpCode(HttpStatus.OK)
    @RequirePermissions(RolePermissionsEnum.UPDATE_PERMISSIONS)
    @CheckPolicies(SystemRolCanNotBeModifiedPolicy)
    @ForceCheckPolicy()
    async updatePermissions(
        @UUID() id: string,
        @Body() dto: PermissionsDto
    )
    {
        this.logger.log('Processing update permissions role request...');
        return await this.updatePermissionsUseCase.handle({ id, dto });
    }

    @Patch(':id/allowed-views')
    @HttpCode(HttpStatus.OK)
    @RequirePermissions(RolePermissionsEnum.UPDATE_ALLOWED_VIEWS)
    @CheckPolicies(SystemRolCanNotBeModifiedPolicy)
    @ForceCheckPolicy()
    async updateAllowedViews(
        @UUID() id: string,
        @Body() dto: AllowedViewsDto
    )
    {
        this.logger.log('Processing update allowed views role request...');
        return await this.updateAllowedViewsUseCase.handle({ id, dto });
    }

    @Patch(':id/scope-config')
    @HttpCode(HttpStatus.OK)
    @RequirePermissions(RolePermissionsEnum.UPDATE_SCOPE_CONFIG)
    @CheckPolicies(SystemRolCanNotBeModifiedPolicy)
    @ForceCheckPolicy()
    async updateScopeConfig(
        @UUID() id: string,
        @Body() dto: ScopeConfigDto
    )
    {
        this.logger.log('Processing update scope config role request...');
        return await this.updateScopeConfigUseCase.handle({ id, dto });
    }
}
