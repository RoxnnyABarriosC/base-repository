import { JWTStrategy, LocalStrategy } from '@modules/auth/domain/strategies';
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
import { TokenRepository } from '@modules/auth/infrastructure/repositories';
import { AuthController } from '@modules/auth/presentation/controllers';
import { RefreshTokenMiddleware } from '@modules/auth/presentation/middlewares';
import { CommonModule } from '@modules/common';
import { RoleModule } from '@modules/role';
import { SecurityConfigModule } from '@modules/securityConfig';
import { UserModule } from '@modules/user';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
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
        RoleModule,
        SecurityConfigModule,
        CommonModule,
        PassportModule,
        RouterModule.register([
            {
                path: 'admin',
                children: [
                    {
                        path: '/',
                        module: UserModule
                    },
                    {
                        path: '/',
                        module: RoleModule
                    }
                ]
            },
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
        AuthController
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
        UpdateFirstLoginUseCase,
        // SERVICES
        TokenService,
        AuthService,
        // REPOSITORIES
        TokenRepository,
        // STRATEGIES
        LocalStrategy,
        JWTStrategy
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
