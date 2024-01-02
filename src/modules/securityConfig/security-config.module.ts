import { AuthModule } from '@modules/auth';
import { UserModule } from '@modules/user';
import { HttpModule } from '@nestjs/axios';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwilioModule } from 'nestjs-twilio';
import { TwilioListener } from './domain/listeners';
import { OTPService, SecurityConfigService } from './domain/services';
import { OTPStrategy } from './domain/strategies';
import {
    EnableOrDisableOTPUseCase,
    EnableOrDisableRequiredPasswordUseCase,
    GetFormConfigUseCase,
    SendOTPUseCase,
    SendPublicOTPUseCase,
    SetPhoneOTPProvidersUseCase
} from './domain/useCases';
import { SecurityConfigRepository } from './infrastructure/repositories';
import { SecurityConfigSchema } from './infrastructure/schemas';
import { OTPTask } from './infrastructure/tasks';
import { OTPController, SecurityController } from './presentation/controllers';

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
    controllers: [OTPController, SecurityController],
    providers: [
        SendOTPUseCase,
        SendPublicOTPUseCase,
        EnableOrDisableOTPUseCase,
        SetPhoneOTPProvidersUseCase,
        GetFormConfigUseCase,
        EnableOrDisableRequiredPasswordUseCase,
        SecurityConfigRepository,
        OTPService,
        TwilioListener,
        OTPTask,
        OTPStrategy,
        SecurityConfigService
    ],
    exports: [OTPService, SecurityConfigRepository, SecurityConfigService]
})
export class SecurityConfigModule
{}
