import { Protected } from '@modules/auth/presentation/decorators';
import { PermissionsDto } from '@modules/role/presentation/dtos';
import { RoleSerializerGroupsEnum } from '@modules/role/presentation/enums';
import { SCOPE } from '@modules/user/domain/constants';
import { AdminUsersOnlyPolicy, CheckDomainEmailUpdatePolicy, DontDeleteYourselfPolicy, SuperAdminCanNotBeModifiedPolicy } from '@modules/user/domain/policies';
import { DontBlockYourselfPolicy } from '@modules/user/domain/policies/dont-block-yourself.policy';
import {
    BlockUserUseCase,
    DeleteUserUseCase,
    EnableOrDisableUserUseCase,
    GetUserByUserNameUseCase,
    GetUserUseCase,
    ListUsersUseCase,
    ResetPasswordUseCase,
    RestoreUserUseCase,
    SaveUserUseCase,
    SetRolesUserUseCase,
    UpdatePermissionsUserUseCase,
    UpdateUserUseCase,
    VerifyOrUnverifyUserUseCase
} from '@modules/user/domain/useCases';
import { UserPermissionsEnum } from '@modules/user/user.permissions';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Logger, Patch, Post, Put } from '@nestjs/common';
import { ALL_MANAGE_PERMISSION } from '@shared/app/constants';
import { CheckEmailDomain, CheckPolicies, ForceCheckPolicy, ManagePermissions, RequirePermissions } from '@shared/app/decorators';
import { SetPipeGroups, SetScopeSerializer, SetSerializerGroups } from '@shared/classValidator/decorators';
import { ContextGroupsEnum } from '@shared/classValidator/enums';
import { Serializer } from '@shared/classValidator/utils';
import { CriteriaBuilder, IUris } from '@shared/criteria';
import { Criteria, Filter, Pagination, Sort, Uris } from '@shared/criteria/decorators';
import { PaginationFilter } from '@shared/criteria/filters';
import { Bool, DeletePermanently, PartialRemoved, UUID } from '@shared/decorators';
import { EmailDomainTypeEnum } from '@shared/enums';
import { UserFilter, UserSort } from '../criterias';
import { UserName } from '../decorators';
import { BlockUserDto, SaveUserDto, SetRolesUserDto, UpdateUserDto } from '../dtos';
import { UserSerializerGroupsEnum } from '../enums';
import { UserSerializer } from '../serializers';

@Controller({
    path: 'users',
    version: '1'
})
@Protected()
@SetScopeSerializer(SCOPE)
@CheckEmailDomain(EmailDomainTypeEnum.ADMIN)
@ManagePermissions(ALL_MANAGE_PERMISSION, UserPermissionsEnum.MANAGE)
export class UserController
{
    private readonly logger = new Logger(UserController.name);

    constructor(
        private readonly saveUseCase: SaveUserUseCase,
        private readonly listUseCase: ListUsersUseCase,
        private readonly getUseCase: GetUserUseCase,
        private readonly deleteUseCase: DeleteUserUseCase,
        private readonly restoreUseCase: RestoreUserUseCase,
        private readonly updateUseCase: UpdateUserUseCase,
        private readonly enableOrDisableUseCase: EnableOrDisableUserUseCase,
        private readonly verifyOrUnverifyUseCase: VerifyOrUnverifyUserUseCase,
        private readonly resetPasswordUseCase: ResetPasswordUseCase,
        private readonly updatePermissionsUseCase: UpdatePermissionsUserUseCase,
        private readonly setRolesUseCase: SetRolesUserUseCase,
        private readonly getByUserNameUseCase: GetUserByUserNameUseCase,
        private readonly blockUserUseCase: BlockUserUseCase
    )
    {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @SetSerializerGroups(
        UserSerializerGroupsEnum.ALL
    )
    @RequirePermissions(UserPermissionsEnum.SAVE)
    @SetPipeGroups(ContextGroupsEnum.APP)
    async save(
        @Body() dto: SaveUserDto
    )
    {
        this.logger.log('Processing save user request...');

        return (await Serializer(await this.saveUseCase.handle({ dto }), UserSerializer)) as typeof UserSerializer;
    }

    @Post('admin')
    @HttpCode(HttpStatus.CREATED)
    @SetSerializerGroups(
        UserSerializerGroupsEnum.ALL
    )
    @RequirePermissions(UserPermissionsEnum.SAVE)
    @SetPipeGroups(ContextGroupsEnum.ADMIN)
    async saveAdmin(
      @Body() dto: SaveUserDto
    )
    {
        this.logger.log('Processing save user admin request...');

        return (await Serializer(await this.saveUseCase.handle({ dto }), UserSerializer)) as typeof UserSerializer;
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @SetSerializerGroups(
        UserSerializerGroupsEnum.ALL,
        RoleSerializerGroupsEnum.ONLY_ID
    )
    @RequirePermissions(UserPermissionsEnum.UPDATE)
    @SetPipeGroups(ContextGroupsEnum.APP)
    @CheckPolicies(SuperAdminCanNotBeModifiedPolicy, CheckDomainEmailUpdatePolicy)
    @ForceCheckPolicy()
    async update(
      @UUID() id: string,
      @Body() dto: UpdateUserDto
    )
    {
        this.logger.log('Processing update user request...');

        return (await Serializer(await this.updateUseCase.handle({
            id, dto
        }), UserSerializer)) as typeof UserSerializer;
    }

    @Put('admin/:id')
    @HttpCode(HttpStatus.OK)
    @SetSerializerGroups(
        UserSerializerGroupsEnum.ALL,
        RoleSerializerGroupsEnum.ONLY_ID
    )
    @RequirePermissions(UserPermissionsEnum.UPDATE)
    @SetPipeGroups(ContextGroupsEnum.ADMIN)
    @CheckPolicies(SuperAdminCanNotBeModifiedPolicy, CheckDomainEmailUpdatePolicy)
    @ForceCheckPolicy()
    async updateAdmin(
      @UUID() id: string,
      @Body() dto: UpdateUserDto
    )
    {
        this.logger.log('Processing update user request...');

        return (await Serializer(await this.updateUseCase.handle({
            id,
            dto
        }), UserSerializer)) as typeof UserSerializer;
    }

    @Get()
    @Criteria()
    @HttpCode(HttpStatus.OK)
    // @SetMethodToUseGroupSerializer('replace')
    @SetSerializerGroups(
        // UserSerializerGroupsEnum.ALL,
        RoleSerializerGroupsEnum.ONLY_ID
    )
    @RequirePermissions(UserPermissionsEnum.LIST)
    async list(
        @Filter() filters: UserFilter,
        @Sort() sorts: UserSort,
        @Pagination() pagination: PaginationFilter,
        @Uris() uris: IUris
    )
    {
        this.logger.log('Processing list users request...');

        const criteria = new CriteriaBuilder({
            filters,
            sorts,
            pagination,
            uris
        });

        return (await Serializer(
            await this.listUseCase.handle({
                criteria
            }), UserSerializer)) as typeof UserSerializer[];
    }

    @Get(':userName')
    @HttpCode(HttpStatus.OK)
    @SetSerializerGroups(
        UserSerializerGroupsEnum.WITH_ROLES,
        UserSerializerGroupsEnum.WITH_PERMISSIONS,
        RoleSerializerGroupsEnum.ONLY_ID
    )
    @RequirePermissions(UserPermissionsEnum.SHOW)
    async getByUserName(
        @UserName() userName: string,
        @PartialRemoved() partialRemoved?: boolean
    )
    {
        this.logger.log('Processing get user request...');

        return (await Serializer(await this.getByUserNameUseCase.handle({
            userName,
            partialRemoved
        }), UserSerializer)) as typeof UserSerializer;
    }

    @Get('id/:id')
    @HttpCode(HttpStatus.OK)
    @SetSerializerGroups(
        UserSerializerGroupsEnum.WITH_ROLES,
        UserSerializerGroupsEnum.WITH_PERMISSIONS,
        RoleSerializerGroupsEnum.ONLY_ID
    )
    @RequirePermissions(UserPermissionsEnum.SHOW)
    async getById(
      @UUID() id: string,
      @PartialRemoved() partialRemoved?: boolean
    )
    {
        this.logger.log('Processing get user request...');

        return (await Serializer(await this.getUseCase.handle({
            id,
            partialRemoved
        }), UserSerializer)) as typeof UserSerializer;
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @SetSerializerGroups(
        UserSerializerGroupsEnum.ALL,
        RoleSerializerGroupsEnum.ONLY_ID
    )
    @RequirePermissions(UserPermissionsEnum.DELETE)
    @CheckPolicies(DontDeleteYourselfPolicy, SuperAdminCanNotBeModifiedPolicy)
    @ForceCheckPolicy()
    async delete(
        @UUID() id: string,
        @DeletePermanently() deletePermanently?: boolean
    )
    {
        this.logger.log('Processing delete user request...');

        return (await Serializer(await this.deleteUseCase.handle({
            id,
            deletePermanently
        }), UserSerializer)) as typeof UserSerializer;
    }

    @Patch(':id/restore')
    @HttpCode(HttpStatus.OK)
    @SetSerializerGroups(
        UserSerializerGroupsEnum.ALL,
        RoleSerializerGroupsEnum.ONLY_ID
    )
    @RequirePermissions(UserPermissionsEnum.RESTORE)
    async restore(
        @UUID() id: string
    )
    {
        this.logger.log('Processing restore user request...');

        return (await Serializer(await this.restoreUseCase.handle({
            id
        }), UserSerializer)) as typeof UserSerializer;
    }

    @Patch(':id/enable/:enable')
    @HttpCode(HttpStatus.OK)
    @RequirePermissions(UserPermissionsEnum.UPDATE_ENABLE)
    @CheckPolicies(SuperAdminCanNotBeModifiedPolicy)
    @ForceCheckPolicy()
    async enableOrDisable(
        @UUID() id: string,
        @Bool() enable: boolean
    )
    {
        return await this.enableOrDisableUseCase.handle({ id, enable });
    }

    @Patch(':id/verify/:verify')
    @HttpCode(HttpStatus.OK)
    @RequirePermissions(UserPermissionsEnum.UPDATE_VERIFY)
    @CheckPolicies(SuperAdminCanNotBeModifiedPolicy)
    @ForceCheckPolicy()
    async verifyOrUnverify(@UUID() id: string, @Bool('verify') verify: boolean)
    {
        return await this.verifyOrUnverifyUseCase.handle({ id, verify });
    }

    // TODO: probar despues de implementar el auth
    @Patch(':id/reset-password')
    @HttpCode(HttpStatus.OK)
    @RequirePermissions(UserPermissionsEnum.RESET_PASSWORD)
    @CheckPolicies(SuperAdminCanNotBeModifiedPolicy)
    @ForceCheckPolicy()
    async resetPassword(
        @UUID() id: string
    )
    {
        return await this.resetPasswordUseCase.handle({ id });
    }

    @Patch(':id/permissions')
    @HttpCode(HttpStatus.OK)
    @SetSerializerGroups(
        UserSerializerGroupsEnum.ALL,
        RoleSerializerGroupsEnum.ONLY_ID
    )
    @RequirePermissions(UserPermissionsEnum.UPDATE_PERMISSIONS)
    @CheckPolicies(SuperAdminCanNotBeModifiedPolicy, AdminUsersOnlyPolicy)
    @ForceCheckPolicy()
    async updatePermissions(
        @UUID() id: string,
        @Body() dto: PermissionsDto)
    {
        return (await Serializer(await this.updatePermissionsUseCase.handle({
            id,
            dto
        }), UserSerializer)) as typeof UserSerializer;
    }

    @Put(':id/roles')
    @HttpCode(HttpStatus.OK)
    @SetSerializerGroups(
        UserSerializerGroupsEnum.ALL,
        RoleSerializerGroupsEnum.ONLY_ID
    )
    @RequirePermissions(UserPermissionsEnum.UPDATE)
    @CheckPolicies(SuperAdminCanNotBeModifiedPolicy, AdminUsersOnlyPolicy)
    @ForceCheckPolicy()
    async setRoles(
        @UUID() id: string,
        @Body() dto: SetRolesUserDto
    )
    {
        return (await Serializer(await this.setRolesUseCase.handle({
            id,
            dto
        }), UserSerializer)) as typeof UserSerializer;
    }

    @Patch(':id/block')
    @HttpCode(HttpStatus.OK)
    @RequirePermissions(UserPermissionsEnum.BLOCK)
    @CheckPolicies(DontBlockYourselfPolicy, SuperAdminCanNotBeModifiedPolicy)
    @ForceCheckPolicy()
    async block(
      @UUID() id: string,
      @Body() dto: BlockUserDto
    )
    {
        return await this.blockUserUseCase.handle({ id, dto });
    }
}
