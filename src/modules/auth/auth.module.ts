import { AppleStrategy, FacebookStrategy, GoogleStrategy, JWTStrategy, LocalStrategy } from '@modules/auth/domain/strategies';
import {
    ActivateAccountUseCase,
    ChangeForgotPasswordUseCase,
    ChangeMyPasswordUseCase,
    ForgotPasswordUseCase,
    LoginUseCase,
    LogoutUseCase, OAuthLoginUseCase,
    RefreshTokenUseCase,
    RegisterUseCase,
    ResetPasswordWithTokenUseCase,
    SetMainPictureOrBannerUseCase,
    UnsetMainPictureOrBannerUseCase,
    UpdateMeUseCase,
    UpdateOnBoardingUseCase
} from '@modules/auth/domain/useCases';
import { TokenRepository } from '@modules/auth/infrastructure/repositories';
import { AuthController, SocialAuthController } from '@modules/auth/presentation/controllers';
import { RefreshTokenMiddleware } from '@modules/auth/presentation/middlewares';
import { CommonModule } from '@modules/common';
import { SecurityConfigModule } from '@modules/securityConfig';
import { UserModule } from '@modules/user';
import { MiddlewareConsumer, Module, NestModule, RequestMethod, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService,  TokenService } from './domain/services';

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
        ActivateAccountUseCase,
        ChangeForgotPasswordUseCase,
        ForgotPasswordUseCase,
        ResetPasswordWithTokenUseCase,
        SetMainPictureOrBannerUseCase,
        UnsetMainPictureOrBannerUseCase,
        UpdateOnBoardingUseCase,
        OAuthLoginUseCase,
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
        AppleStrategy
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
