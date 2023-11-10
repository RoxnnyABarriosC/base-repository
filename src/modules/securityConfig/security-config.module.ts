import { AuthModule } from '@modules/auth';
import { TwilioListener } from '@modules/securityConfig/domain/listeners';
import { OTPService } from '@modules/securityConfig/domain/services';
import { OTPStrategy } from '@modules/securityConfig/domain/strategies/otp.strategy';
import {
    EnableOrDisableOTPUseCase,
    SendOTPUseCase,
    SendPublicOTPUseCase,
    SetPhoneOTPProvidersUseCase
} from '@modules/securityConfig/domain/useCases';
import { SecurityConfigRepository } from '@modules/securityConfig/infrastructure/repositories';
import { SecurityConfigSchema } from '@modules/securityConfig/infrastructure/schemas';
import { OTPTask } from '@modules/securityConfig/infrastructure/tasks';
import { OTPController } from '@modules/securityConfig/presentation/controllers';
import { UserModule } from '@modules/user';
import { HttpModule } from '@nestjs/axios';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwilioModule } from 'nestjs-twilio';

@Module({
    imports: [
        TypeOrmModule.forFeature([SecurityConfigSchema]),
        forwardRef(() => AuthModule),
        forwardRef(() => UserModule),
        HttpModule,
        TwilioModule.forRootAsync({
            inject: [ConfigService],
            isGlobal: true,
            useFactory: (config: ConfigService) => ({
                ... config.getOrThrow('twilio')
            })
        })
    ],
    controllers: [OTPController],
    providers: [
        SendOTPUseCase,
        SendPublicOTPUseCase,
        EnableOrDisableOTPUseCase,
        SetPhoneOTPProvidersUseCase,
        SecurityConfigRepository,
        OTPService,
        TwilioListener,
        OTPTask,
        OTPStrategy
    ],
    exports: [OTPService, SecurityConfigRepository]
})
export class SecurityConfigModule
{}
