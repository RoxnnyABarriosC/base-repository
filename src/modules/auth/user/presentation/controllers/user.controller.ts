import { ManagePermissions, Protected, RequirePermissions } from '@modules/auth/index/presentation/decorators';
import { PermissionsDto } from '@modules/auth/role/presentation/dtos';
import { RoleSerializerGroupsEnum } from '@modules/auth/role/presentation/enums';
import { SCOPE } from '@modules/auth/user/domain/constants';
import {
    DeleteUserUseCase, EnableOrDisableUserUseCase,
    GetUserUseCase,
    ListUsersUseCase, ResetPasswordUseCase, RestoreUserUseCase,
    SaveUserUseCase, SetRolesUserUseCase, UpdatePermissionsUserUseCase, UpdateUserUseCase, VerifyOrUnverifyUserUseCase
} from '@modules/auth/user/domain/useCases';
import { UserFilter, UserSort } from '@modules/auth/user/presentation/criterias';
import { SaveUserDto, SetRolesUserDto, UpdateUserDto } from '@modules/auth/user/presentation/dtos';
import { UserSerializerGroupsEnum } from '@modules/auth/user/presentation/enums';
import { UserSerializer } from '@modules/auth/user/presentation/serializers';
import { UserPermissionsEnum } from '@modules/auth/user/user.permissions';
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
import { CriteriaBuilder, PaginationFilter, UrisInterface } from '@shared/criterias';
import {
    Bool,
    Criteria,
    DeletePermanently,
    Filter,
    Pagination,
    PartialRemoved,
    SetSerializerGroups,
    Sort, UUID, Uris
} from '@shared/decorators';
import { ALL_MANAGE_PERMISSION } from '@shared/factories';
import { SetScopeSerializer } from '@shared/interceptors';
import { Serializer } from '@shared/utils';

@Controller({
    path: 'users',
    version: '1'
})
@Protected()
@SetScopeSerializer(SCOPE)
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
        private readonly setRolesUseCase: SetRolesUserUseCase
    )
    {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @SetSerializerGroups(
        UserSerializerGroupsEnum.ALL
    )
    @RequirePermissions(UserPermissionsEnum.SAVE)
    async save(
        @Body() dto: SaveUserDto
    )
    {
        this.logger.log('Processing save user request...');

        return (await Serializer(await this.saveUseCase.handle({ dto }), UserSerializer)) as typeof UserSerializer;
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
        @Uris() uris: UrisInterface
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

    @Get(':username')
    @HttpCode(HttpStatus.OK)
    @SetSerializerGroups(
        UserSerializerGroupsEnum.WITH_ROLES,
        UserSerializerGroupsEnum.WITH_PERMISSIONS,
        RoleSerializerGroupsEnum.ONLY_ID
    )
    @RequirePermissions(UserPermissionsEnum.SHOW)
    async get(
        @Param('username') userName: string,
        @PartialRemoved() partialRemoved?: boolean
    )
    {
        this.logger.log('Processing get user request...');

        return (await Serializer(await this.getUseCase.handle({
            userName,
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

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @SetSerializerGroups(
        UserSerializerGroupsEnum.ALL,
        RoleSerializerGroupsEnum.ONLY_ID
    )
    @RequirePermissions(UserPermissionsEnum.UPDATE)
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

    @Patch(':id/enable-or-disable/:enable')
    @HttpCode(HttpStatus.OK)
    @RequirePermissions(UserPermissionsEnum.UPDATE_ENABLE)
    async enableOrDisable(
        @UUID() id: string,
        @Bool() enable: boolean
    )
    {
        return await this.enableOrDisableUseCase.handle({ id, enable });
    }

    @Patch(':id/verify-or-unverify/:verify')
    @HttpCode(HttpStatus.OK)
    @RequirePermissions(UserPermissionsEnum.UPDATE_VERIFY)
    async verifyOrUnverify(@UUID() id: string, @Bool('verify') verify: boolean)
    {
        return await this.verifyOrUnverifyUseCase.handle({ id, verify });
    }

    // TODO: probar despues de implementar el auth
    @Patch(':id/reset-password')
    @HttpCode(HttpStatus.OK)
    @RequirePermissions(UserPermissionsEnum.RESET_PASSWORD)
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
}
