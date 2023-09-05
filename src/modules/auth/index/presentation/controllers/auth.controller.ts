import { DecodeTokenInterface } from '@modules/auth/index/domain/models';
import {
    ActivateAccountUseCase,
    ChangeForgotPasswordUseCase,
    ChangeMyPasswordUseCase,
    ForgotPasswordUseCase,
    LoginUseCase,
    LogoutUseCase,
    RefreshTokenUseCase,
    RegisterUseCase,
    ResetPasswordWithTokenUseCase,
    SetMainPictureOrBannerUseCase,
    UnsetMainPictureOrBannerUseCase,
    UpdateFirstLoginUseCase,
    UpdateMeUseCase
} from '@modules/auth/index/domain/useCases';
import {
    AuthUser,
    CheckRefreshToken, DecodeRefreshToken,
    DecodeToken,
    LocalAuth,
    Protected
} from '@modules/auth/index/presentation/decorators';
import { ChangeMyPasswordDto } from '@modules/auth/index/presentation/dtos/change-my-password.dto';
import { ForgotPasswordDto } from '@modules/auth/index/presentation/dtos/forgot-password.dto';
import { LoginDto } from '@modules/auth/index/presentation/dtos/login.dto';
import { MeDto } from '@modules/auth/index/presentation/dtos/me.dto';
import { RegisterDto } from '@modules/auth/index/presentation/dtos/register.dto';
import { AuthSerializer, AuthUserSerializer } from '@modules/auth/index/presentation/serializers';
import { RoleSerializerGroupsEnum } from '@modules/auth/role/presentation/serializers';
import { SCOPE } from '@modules/auth/user/domain/constants';
import { User } from '@modules/auth/user/domain/entities';
import { PropertyFileEnum } from '@modules/auth/user/domain/enums';
import { PasswordDto } from '@modules/auth/user/presentation/dtos';
import { UserSerializerGroupsEnum } from '@modules/auth/user/presentation/serializers';
import { MimeTypeEnum } from '@modules/common/file/domain/enums';
import { UploadFile, UploadedFile
} from '@modules/common/file/presentation/decorators';
import { FileSerializer } from '@modules/common/file/presentation/serializers';
import { MyStore } from '@modules/common/store';
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Logger,
    Param,
    ParseEnumPipe,
    Patch,
    Post,
    Put, Query,
    Res, ValidationPipe
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Agent, SetSerializerGroups, UserAgent } from '@shared/decorators';
import { SetScopeSerializer } from '@shared/interceptors';
import { SendRefresh, Serializer } from '@shared/utils';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { FastifyReply } from 'fastify';
import { MulterFile } from 'fastify-file-interceptor';
import { ClsService } from 'nestjs-cls';
dayjs.extend(utc);

@Controller({
    path: 'auth',
    version: '1'
})
@SetScopeSerializer(SCOPE)
export class AuthController
{
    private readonly logger = new Logger(AuthController.name);

    constructor(
        private readonly store: ClsService<MyStore>,
        private readonly configService: ConfigService,
        private readonly loginUseCase: LoginUseCase,
        private readonly registerUseCase: RegisterUseCase,
        private readonly updateMeUseCase: UpdateMeUseCase,
        private readonly logoutUseCase: LogoutUseCase,
        private readonly refreshTokenUseCase: RefreshTokenUseCase,
        private readonly changeMyPasswordUseCase: ChangeMyPasswordUseCase,
        private readonly activateAccountUseCase: ActivateAccountUseCase,
        private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
        private readonly changeForgotPasswordUseCase: ChangeForgotPasswordUseCase,
        private readonly resetPasswordUseCase: ResetPasswordWithTokenUseCase,
        private readonly setMainPictureOrBannerUseCase: SetMainPictureOrBannerUseCase,
        private readonly unsetMainPictureOrBannerUseCase: UnsetMainPictureOrBannerUseCase,
        private readonly updateFirstLoginUseCase: UpdateFirstLoginUseCase
    )
    {}

    @Patch('me/first-login')
    @HttpCode(HttpStatus.OK)
    @Protected()
    async setFirstLogin(@AuthUser() authUser: User)
    {
        return await this.updateFirstLoginUseCase.handle({
            authUser,
            firstLogin: true
        });
    }

    @Get('me')
    @HttpCode(HttpStatus.OK)
    @Protected()
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

    @Put('me')
    @Protected()
    @HttpCode(HttpStatus.OK)
    @SetSerializerGroups(
        UserSerializerGroupsEnum.WITH_ROLES,
        UserSerializerGroupsEnum.WITH_PERMISSIONS,
        RoleSerializerGroupsEnum.ONLY_ID
    )
    async updateMe(
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() dto: MeDto,
    @AuthUser() authUser: User,
    @UserAgent() agent: any
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

    @Patch('me/set/:property')
    @HttpCode(HttpStatus.OK)
    @Protected()
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

    @Patch('me/unset/:property')
    @Protected()
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

    // ======================================================================AUTH======================================================================

    @Post('login')
    @LocalAuth()
    @HttpCode(HttpStatus.CREATED)
    @SetSerializerGroups(
        UserSerializerGroupsEnum.WITH_ROLES,
        UserSerializerGroupsEnum.WITH_PERMISSIONS,
        RoleSerializerGroupsEnum.ONLY_ID
    )
    async login(
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() dto: LoginDto,
    @AuthUser() authUser: User,
    @UserAgent() agent: Agent
    )
    {
        const data = await this.loginUseCase.handle({ user: authUser });

        SendRefresh({
            res,
            agent,
            configService: this.configService,
            store: this.store,
            refreshHash: data.RefreshHash,
            expiresRefresh: data.ExpiresRefresh
        });

        return (await Serializer(data, AuthSerializer)) as typeof AuthSerializer;
    }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() dto: RegisterDto)
    {
        return await this.registerUseCase.handle({ dto });
    }

    @Post('logout')
    @Protected()
    @CheckRefreshToken()
    @HttpCode(HttpStatus.OK)
    async logout(
    @Res({ passthrough: true }) res: FastifyReply,
    @DecodeToken() decodeToken: DecodeTokenInterface,
    @DecodeRefreshToken() decodeRefreshToken: DecodeTokenInterface,
    @AuthUser() authUser: User,
    @UserAgent() agent: Agent
    )
    {
        const data = await this.logoutUseCase.handle({
            authUser,
            decodeRefreshTokenId: decodeRefreshToken.id,
            decodeTokenId: decodeToken.id
        });

        SendRefresh({
            res,
            agent,
            configService: this.configService,
            store: this.store
        });

        return data;
    }

    @Post('refresh-token')
    @CheckRefreshToken()
    @HttpCode(HttpStatus.CREATED)
    @SetSerializerGroups(
        UserSerializerGroupsEnum.WITH_ROLES,
        UserSerializerGroupsEnum.WITH_PERMISSIONS,
        RoleSerializerGroupsEnum.ONLY_ID
    )
    async refreshToken(
    @Res({ passthrough: true }) res: FastifyReply,
    @DecodeRefreshToken() decodeRefreshToken: DecodeTokenInterface,
    @UserAgent() agent: Agent
    )
    {
        const data = await this.refreshTokenUseCase.handle({
            decodeRefreshToken
        });

        SendRefresh({
            res,
            agent,
            configService: this.configService,
            store: this.store,
            refreshHash: data.RefreshHash,
            expiresRefresh: data.ExpiresRefresh
        });

        return (await Serializer(data, AuthSerializer)) as typeof AuthSerializer;
    }

    @Patch('change-my-password')
    @Protected()
    @HttpCode(HttpStatus.CREATED)
    async changeMyPassword(
    @Body() dto: ChangeMyPasswordDto,
    @AuthUser() authUser: User
    )
    {
        return await this.changeMyPasswordUseCase.handle({ dto, authUser });
    }

    @Patch('activate-your-account')
    @HttpCode(HttpStatus.CREATED)
    async activateAccount(@Query('token') confirmationToken: string)
    {
        return await this.activateAccountUseCase.handle({
            confirmationToken
        });
    }

    @Post('forgot-password')
    @HttpCode(HttpStatus.CREATED)
    async forgotPassword(@Body() dto: ForgotPasswordDto)
    {
        return await this.forgotPasswordUseCase.handle({ dto });
    }

    @Patch('change-forgot-password')
    @HttpCode(HttpStatus.CREATED)
    async changeForgotPassword(
    @Body() dto: PasswordDto,
    @Query('token') confirmationToken: string
    )
    {
        return await this.changeForgotPasswordUseCase.handle(
            dto,
            confirmationToken
        );
    }

    @Patch('reset-password')
    @HttpCode(HttpStatus.CREATED)
    async resetPassword(
    @Body() dto: ChangeMyPasswordDto,
    @Query('token') confirmationToken: string
    )
    {
        return await this.resetPasswordUseCase.handle({
            dto,
            confirmationToken
        });
    }
}
