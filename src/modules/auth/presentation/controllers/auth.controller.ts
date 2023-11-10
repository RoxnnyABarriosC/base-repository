import { IDecodeToken } from '@modules/auth/domain/models';
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
} from '@modules/auth/domain/useCases';
import {
    AuthUser,
    CheckRefreshToken, DecodeRefreshToken,
    DecodeToken,
    LocalAuth,
    Protected
} from '@modules/auth/presentation/decorators';
import { ChangeMyPasswordDto, ForgotPasswordDto, LoginDto, MeDto, RegisterDto, StepperLoginDto } from '@modules/auth/presentation/dtos';
import { AuthSerializer, AuthUserSerializer } from '@modules/auth/presentation/serializers';
import { MimeTypeEnum } from '@modules/common/file/domain/enums';
import { UploadFile, UploadedFile
} from '@modules/common/file/presentation/decorators';
import { FileSerializer } from '@modules/common/file/presentation/serializers';
import { IMyStore } from '@modules/common/store';
import { RoleSerializerGroupsEnum } from '@modules/role/presentation/enums';
import { SCOPE } from '@modules/user/domain/constants';
import { User } from '@modules/user/domain/entities';
import { PropertyFileEnum } from '@modules/user/domain/enums';
import { PasswordDto } from '@modules/user/presentation/dtos';
import { UserSerializerGroupsEnum } from '@modules/user/presentation/enums';
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
    Query,
    Res, UseGuards, UsePipes, ValidationPipe
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Agent, ApplyValidationBody, SetSerializerGroups, UserAgent } from '@shared/decorators';
import { ValidationGuard } from '@shared/guards';
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
        private readonly store: ClsService<IMyStore>,
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

    @Patch('me')
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
    @HttpCode(HttpStatus.CREATED)
    @LocalAuth()
    @ApplyValidationBody(LoginDto)
    @SetSerializerGroups(
        UserSerializerGroupsEnum.WITH_ROLES,
        UserSerializerGroupsEnum.WITH_PERMISSIONS,
        RoleSerializerGroupsEnum.ONLY_ID
    )
    async login(
        @Res({ passthrough: true }) res: FastifyReply,
        @Body(new ValidationPipe()) dto: LoginDto,
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

    @Post('stepper-login')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard('otp'))
    @ApplyValidationBody(StepperLoginDto)
    @SetSerializerGroups(
        UserSerializerGroupsEnum.WITH_ROLES,
        UserSerializerGroupsEnum.WITH_PERMISSIONS,
        RoleSerializerGroupsEnum.ONLY_ID
    )
    async stepperLogin(
      @Res({ passthrough: true }) res: FastifyReply,
      @Body() dto: StepperLoginDto,
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
    @DecodeToken() decodeToken: IDecodeToken,
    @DecodeRefreshToken() decodeRefreshToken: IDecodeToken,
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
    @DecodeRefreshToken() decodeRefreshToken: IDecodeToken,
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
        return await this.changeForgotPasswordUseCase.handle({
            dto,
            confirmationToken
        }
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
