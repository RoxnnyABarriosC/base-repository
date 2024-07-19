import { IDecodeToken } from '@modules/auth/domain/models';
import {
    ChangeForgotPasswordUseCase,
    ForgotPasswordUseCase,
    LoginUseCase,
    LogoutUseCase, OTPForgotPasswordUseCase, OTPRegisterUseCase,
    RefreshTokenUseCase,
    RegisterUseCase, ResendVerifyAccountUseCase,
    VerifyAccountUseCase
} from '@modules/auth/domain/useCases';
import { OTPRegisterDto } from '@modules/auth/presentation/dtos/otp-register.dto';
import { IMyStore } from '@modules/common/store';
import { RoleSerializerGroupsEnum } from '@modules/role/presentation/enums';
import { OTPAuth } from '@modules/securityConfig/presentation/decorators';
import { SCOPE } from '@modules/user/domain/constants';
import { User } from '@modules/user/domain/entities';
import { PasswordDto } from '@modules/user/presentation/dtos';
import { UserSerializerGroupsEnum } from '@modules/user/presentation/enums';
import {
    Body,
    Controller, Headers,
    HttpCode,
    HttpStatus,
    Logger,
    Patch,
    Post,
    Query,
    Res
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Agent, UserAgent } from '@shared/app/decorators';
import { SendRefresh } from '@shared/app/utils';
import { ApplyValidationBody, SetPipeGroups, SetScopeSerializer, SetSerializerGroups } from '@shared/classValidator/decorators';
import { ContextGroupsEnum } from '@shared/classValidator/enums';
import { Email } from '@shared/classValidator/transforms';
import { Serializer } from '@shared/classValidator/utils';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { FastifyReply } from 'fastify';
import { ClsService } from 'nestjs-cls';
import {
    AuthUser,
    CheckRefreshToken, DecodeRefreshToken,
    DecodeToken, LocalAuth,
    Protected
} from '../decorators';
import { ForgotPasswordDto, LoginDto, OTPForgotPasswordDto, OTPLoginDto, RegisterDto } from '../dtos';
import { AuthSerializer } from '../serializers';
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
        private readonly logoutUseCase: LogoutUseCase,
        private readonly refreshTokenUseCase: RefreshTokenUseCase,
        private readonly verifyAccountUseCase: VerifyAccountUseCase,
        private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
        private readonly changeForgotPasswordUseCase: ChangeForgotPasswordUseCase,
        private readonly resendVerifyAccountUseCase: ResendVerifyAccountUseCase,
        private readonly otpForgotPasswordOTPUseCase: OTPForgotPasswordUseCase,
        private readonly otpRegisterUseCase: OTPRegisterUseCase
    )
    {}

    @Post('basic-login')
    @HttpCode(HttpStatus.CREATED)
    @LocalAuth()
    @ApplyValidationBody(LoginDto)
    @SetSerializerGroups(
        UserSerializerGroupsEnum.WITH_ROLES,
        UserSerializerGroupsEnum.WITH_PERMISSIONS,
        RoleSerializerGroupsEnum.ONLY_ID
    )
    async basicLogin(
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

    @Post('login')
    @HttpCode(HttpStatus.CREATED)
    @OTPAuth()
    @ApplyValidationBody(OTPLoginDto)
    @SetSerializerGroups(
        UserSerializerGroupsEnum.WITH_ROLES,
        UserSerializerGroupsEnum.WITH_PERMISSIONS,
        RoleSerializerGroupsEnum.ONLY_ID
    )
    @SetPipeGroups(ContextGroupsEnum.APP)
    async login(
      @Res({ passthrough: true }) res: FastifyReply,
      @Body() dto: OTPLoginDto,
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


    @Post('login-admin')
    @HttpCode(HttpStatus.CREATED)
    @OTPAuth()
    @ApplyValidationBody(OTPLoginDto)
    @SetSerializerGroups(
        UserSerializerGroupsEnum.WITH_ROLES,
        UserSerializerGroupsEnum.WITH_PERMISSIONS,
        RoleSerializerGroupsEnum.ONLY_ID
    )
    @SetPipeGroups(ContextGroupsEnum.ADMIN)
    async loginAdmin(
      @Res({ passthrough: true }) res: FastifyReply,
      @Body() dto: OTPLoginDto,
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
    @SetPipeGroups(ContextGroupsEnum.APP)
    async register(@Body() dto: RegisterDto)
    {
        return await this.registerUseCase.handle({ dto });
    }

    @Post('otp-register')
    @HttpCode(HttpStatus.CREATED)
    @SetPipeGroups(ContextGroupsEnum.APP)
    async otpRegister(
      @Res({ passthrough: true }) res: FastifyReply,
      @Body() dto: OTPRegisterDto,
      @UserAgent() agent: Agent
    )
    {
        const data = await this.otpRegisterUseCase.handle({ dto });

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

    @Patch('verify-account')
    @HttpCode(HttpStatus.CREATED)
    async verifyAccount(@Query('token') confirmationToken: string)
    {
        return await this.verifyAccountUseCase.handle({
            confirmationToken
        });
    }

    @Post('forgot-password')
    @HttpCode(HttpStatus.CREATED)
    @SetPipeGroups(ContextGroupsEnum.APP)
    async forgotPassword(@Body() dto: ForgotPasswordDto)
    {
        return await this.forgotPasswordUseCase.handle({ dto });
    }

    @Post('otp-forgot-password')
    @HttpCode(HttpStatus.CREATED)
    @SetPipeGroups(ContextGroupsEnum.APP)
    async forgotPasswordOTP(
      @Body() dto: OTPForgotPasswordDto
    )
    {
        return await this.otpForgotPasswordOTPUseCase.handle({ dto });
    }

    @Patch('change-password')
    @HttpCode(HttpStatus.CREATED)
    async changePassword(
      @Body() dto: PasswordDto,
      @Query('token') confirmationToken: string
    )
    {
        return await this.changeForgotPasswordUseCase.handle({
            dto,
            confirmationToken
        });
    }

    @Post('verify-account/:email')
    @HttpCode(HttpStatus.CREATED)
    async resendVerifyAccount(
      @Email() email: string
    )
    {
        return await this.resendVerifyAccountUseCase.handle({
            email
        });
    }
}
