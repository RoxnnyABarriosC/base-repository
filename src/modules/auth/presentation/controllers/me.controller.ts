import {
    ChangeMyEmailOrPhoneUseCase,
    ChangeMyPasswordUseCase,
    DeleteAccountUseCase,
    SetMainPictureOrBannerUseCase,
    UnsetMainPictureOrBannerUseCase,
    UpdateMeUseCase,
    UpdateOnBoardingUseCase
} from '@modules/auth/domain/useCases';
import { MimeTypeEnum } from '@modules/common/file/domain/enums';
import { UploadFile, UploadedFile } from '@modules/common/file/presentation/decorators';
import { FileSerializer } from '@modules/common/file/presentation/serializers';
import { RoleSerializerGroupsEnum } from '@modules/role/presentation/enums';
import { OTPTargetConfigEnum } from '@modules/securityConfig/domain/enums';
import { SCOPE } from '@modules/user/domain/constants';
import { User } from '@modules/user/domain/entities';
import { PropertyFileEnum } from '@modules/user/domain/enums';
import { AdminCantUpdateEmailPolicy, AdminCantUpdateUserNamePolicy } from '@modules/user/domain/policies';
import { UserSerializerGroupsEnum } from '@modules/user/presentation/enums';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Logger, Param, ParseEnumPipe, Patch } from '@nestjs/common';
import { CheckEmailDomain, CheckPolicies, ForceCheckPolicy } from '@shared/app/decorators';
import { SetPipeGroups, SetScopeSerializer, SetSerializerGroups } from '@shared/classValidator/decorators';
import { ContextGroupsEnum } from '@shared/classValidator/enums';
import { Serializer } from '@shared/classValidator/utils';
import { EmailDomainTypeEnum } from '@shared/enums';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { MulterFile } from 'fastify-file-interceptor';
import { AuthUser, Protected } from '../decorators';
import { ChangeMyEmailDto, ChangeMyPasswordDto, ChangeMyPhoneDto, MeDto } from '../dtos';
import { AuthUserSerializer } from '../serializers';

dayjs.extend(utc);

@Controller({
    path: 'auth',
    version: '1'
})
@Protected()
@SetScopeSerializer(SCOPE)
export class MeController
{
    private readonly logger = new Logger(MeController.name);

    constructor(
        private readonly updateMeUseCase: UpdateMeUseCase,
        private readonly setMainPictureOrBannerUseCase: SetMainPictureOrBannerUseCase,
        private readonly unsetMainPictureOrBannerUseCase: UnsetMainPictureOrBannerUseCase,
        private readonly updateOnBoardingUseCase: UpdateOnBoardingUseCase,
        private readonly changeMyPasswordUseCase: ChangeMyPasswordUseCase,
        private readonly deleteAccountUseCase: DeleteAccountUseCase,
        private readonly changeMyEmailOrPhoneUseCase: ChangeMyEmailOrPhoneUseCase

    )
    {}

    @Patch('me/on-boarding')
    @HttpCode(HttpStatus.OK)
    async setOnBoarding(@AuthUser() authUser: User)
    {
        return await this.updateOnBoardingUseCase.handle({
            authUser,
            onBoarding: true
        });
    }

    @Get('me')
    @HttpCode(HttpStatus.OK)
    @SetSerializerGroups(
        UserSerializerGroupsEnum.WITH_ROLES,
        UserSerializerGroupsEnum.WITH_PERMISSIONS,
        RoleSerializerGroupsEnum.ONLY_ID
    )
    async me(@AuthUser() authUser: User)
    {
        return (await Serializer(
            authUser,
            AuthUserSerializer
        )) as typeof AuthUserSerializer;
    }

    @Patch('me')
    @HttpCode(HttpStatus.OK)
    @SetSerializerGroups(
        UserSerializerGroupsEnum.WITH_ROLES,
        UserSerializerGroupsEnum.WITH_PERMISSIONS,
        RoleSerializerGroupsEnum.ONLY_ID
    )
    @SetPipeGroups(ContextGroupsEnum.APP)
    @CheckEmailDomain(EmailDomainTypeEnum.APP)
    async updateMe(
    @Body() dto: MeDto,
    @AuthUser() authUser: User
    )
    {
        return (await Serializer(
            await this.updateMeUseCase.handle({
                dto,
                authUser
            }),
            AuthUserSerializer
        )) as typeof AuthUserSerializer;
    }

    @Patch('me-admin')
    @HttpCode(HttpStatus.OK)
    @SetSerializerGroups(
        UserSerializerGroupsEnum.WITH_ROLES,
        UserSerializerGroupsEnum.WITH_PERMISSIONS,
        RoleSerializerGroupsEnum.ONLY_ID
    )
    @CheckPolicies(AdminCantUpdateEmailPolicy, AdminCantUpdateUserNamePolicy)
    @ForceCheckPolicy()
    @SetPipeGroups(ContextGroupsEnum.ADMIN)
    @CheckEmailDomain(EmailDomainTypeEnum.ADMIN)
    async updateMeAdmin(
      @Body() dto: MeDto,
      @AuthUser() authUser: User
    )
    {
        return (await Serializer(
            await this.updateMeUseCase.handle({
                dto,
                authUser
            }),
            AuthUserSerializer
        )) as typeof AuthUserSerializer;
    }

    @Patch('me/:property')
    @HttpCode(HttpStatus.OK)
    @UploadFile()
    async setMainPicture(
        @UploadedFile({
            fileType: [MimeTypeEnum.WEBP, MimeTypeEnum.PNG]
        }) rawFile: MulterFile,
        @Param('property',
            new ParseEnumPipe(PropertyFileEnum)
        ) property: unknown,
        @AuthUser() authUser: User
    )
    {
        return (await Serializer(
            await this.setMainPictureOrBannerUseCase.handle({
                rawFile,
                authUser,
                property: property as PropertyFileEnum
            }),
            FileSerializer
        )) as typeof FileSerializer;
    }

    @Delete('me/:property')
    @HttpCode(HttpStatus.OK)
    // TODO: proximamente agregar query param para condicionar si el unset solo quitara la imagen o tambien la borrara
    async unsetMainPicture(
        @Param('property',
            new ParseEnumPipe(PropertyFileEnum)
        ) property: unknown,
        @AuthUser() authUser: User
    )
    {
        return  await this.unsetMainPictureOrBannerUseCase.handle({
            authUser,
            property: property as PropertyFileEnum
        });
    }

    @Patch('me/change-password')
    @HttpCode(HttpStatus.OK)
    async changeMyPassword(
      @Body() dto: ChangeMyPasswordDto,
      @AuthUser() authUser: User
    )
    {
        return await this.changeMyPasswordUseCase.handle({ dto, authUser });
    }

    @Patch('me/change-email')
    @HttpCode(HttpStatus.OK)
    async changeMyEmail(
      @Body() dto: ChangeMyEmailDto,
      @AuthUser() authUser: User
    )
    {
        return await this.changeMyEmailOrPhoneUseCase.handle({ dto, authUser, target: OTPTargetConfigEnum.EMAIL });
    }

    @Patch('me/change-phone')
    @HttpCode(HttpStatus.OK)
    async changeMyPhone(
      @Body() dto: ChangeMyPhoneDto,
      @AuthUser() authUser: User
    )
    {
        return await this.changeMyEmailOrPhoneUseCase.handle({ dto, authUser, target: OTPTargetConfigEnum.PHONE });
    }

    @Delete('me')
    @HttpCode(HttpStatus.OK)
    @CheckEmailDomain(EmailDomainTypeEnum.APP)
    async deleteAccount(
      @AuthUser() authUser: User
    )
    {
        return await this.deleteAccountUseCase.handle({ id: authUser._id });
    }
}
