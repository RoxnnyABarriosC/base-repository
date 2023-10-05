import { JwtStrategy, LocalStrategy } from '@modules/auth/index/domain/strategies';
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
import { TokenRepository } from '@modules/auth/index/infrastructure/repositories';
import { AuthController } from '@modules/auth/index/presentation/controllers';
import { RefreshTokenMiddleware } from '@modules/auth/index/presentation/middlewares';
import { OTPModule } from '@modules/auth/otp';
import { RoleModule } from '@modules/auth/role';
import { UserModule } from '@modules/auth/user';
import { CommonModule } from '@modules/common';
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
                secret: config.get('jwt.secret'),
                signOptions: { expiresIn: config.get('jwt.expires') },
                algorithm: config.get('jwt.algorithm')
            })
        }),
        UserModule,
        RoleModule,
        OTPModule,
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
                        module: OTPModule
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
        JwtStrategy
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
