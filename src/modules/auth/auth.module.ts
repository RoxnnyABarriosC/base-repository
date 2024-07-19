import { DeleteAccountTask } from '@modules/auth/infrastructure/tasks';
import { CommonModule } from '@modules/common';
import { SecurityConfigModule } from '@modules/securityConfig';
import { UserModule } from '@modules/user';
import { MiddlewareConsumer, Module, NestModule, RequestMethod, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService,  TokenService } from './domain/services';
import { AppleStrategy, FacebookStrategy, GoogleStrategy, JWTStrategy, JWTWebsocketStrategy, LocalStrategy } from './domain/strategies';
import {
    ChangeForgotPasswordUseCase, ChangeMyEmailOrPhoneUseCase,
    ChangeMyPasswordUseCase,
    DeleteAccountUseCase, ForgotPasswordUseCase,
    LoginUseCase,
    LogoutUseCase,
    OAuthLoginUseCase, OTPForgotPasswordUseCase, OTPRegisterUseCase, RefreshTokenUseCase,
    RegisterUseCase, ResendVerifyAccountUseCase,
    SetMainPictureOrBannerUseCase,
    UnsetMainPictureOrBannerUseCase,
    UpdateMeUseCase,
    UpdateOnBoardingUseCase,
    VerifyAccountUseCase
} from './domain/useCases';
import { TokenRepository } from './infrastructure/repositories';
import { AuthController, MeController, SocialAuthController } from './presentation/controllers';
import { RefreshTokenMiddleware } from './presentation/middlewares';

@Module({
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.getOrThrow('jwt.secret'),
                signOptions: { expiresIn: config.getOrThrow('jwt.expires') },
                algorithm: config.getOrThrow('jwt.algorithm')
            })
        }),
        UserModule,
        CommonModule,
        PassportModule,
        forwardRef(() => SecurityConfigModule),
        RouterModule.register([
            {
                path: 'auth',
                children: [
                    {
                        path: '/',
                        module: SecurityConfigModule
                    }
                ]
            }
        ])
    ],
    controllers: [
        MeController,
        AuthController,
        SocialAuthController
    ],
    providers:[
        // USE CASES
        LoginUseCase,
        LogoutUseCase,
        RefreshTokenUseCase,
        RegisterUseCase,
        UpdateMeUseCase,
        ChangeMyPasswordUseCase,
        VerifyAccountUseCase,
        ChangeForgotPasswordUseCase,
        ForgotPasswordUseCase,
        SetMainPictureOrBannerUseCase,
        UnsetMainPictureOrBannerUseCase,
        UpdateOnBoardingUseCase,
        OAuthLoginUseCase,
        DeleteAccountUseCase,
        ResendVerifyAccountUseCase,
        OTPForgotPasswordUseCase,
        OTPRegisterUseCase,
        ChangeMyEmailOrPhoneUseCase,
        // SERVICES
        TokenService,
        AuthService,
        // REPOSITORIES
        TokenRepository,
        // STRATEGIES
        LocalStrategy,
        JWTStrategy,
        FacebookStrategy,
        GoogleStrategy,
        AppleStrategy,
        JWTWebsocketStrategy,
        DeleteAccountTask
    ],
    exports: [
        TokenService,
        AuthService
    ]
})
export class AuthModule implements NestModule
{
    configure(consumer: MiddlewareConsumer)
    {
        consumer.apply(RefreshTokenMiddleware).forRoutes({
            path: 'v1/auth/logout',
            method: RequestMethod.POST
        }, {
            path: 'v1/auth/refresh-token',
            method: RequestMethod.POST
        });
    }
}
