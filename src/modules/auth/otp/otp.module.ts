import { AuthModule } from '@modules/auth';
import { TwilioListener } from '@modules/auth/otp/domain/listeners';
import { OTPService } from '@modules/auth/otp/domain/services';
import {
    EnableOrDisableOtpUseCase,
    SendOtpUseCase,
    SetPhoneOtpProvidersOtpUseCase
} from '@modules/auth/otp/domain/useCases';
import { OTPRepository } from '@modules/auth/otp/infrastructure/repositories';
import { OTPSchema } from '@modules/auth/otp/infrastructure/schemas';
import { OtpTask } from '@modules/auth/otp/infrastructure/tasks';
import { OTPController } from '@modules/auth/otp/presentation/controllers';
import { HttpModule } from '@nestjs/axios';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwilioModule } from 'nestjs-twilio';

@Module({
    imports: [
        TypeOrmModule.forFeature([OTPSchema]),
        forwardRef(() => AuthModule),
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
        SendOtpUseCase,
        EnableOrDisableOtpUseCase,
        SetPhoneOtpProvidersOtpUseCase,
        OTPRepository,
        OTPService,
        TwilioListener,
        OtpTask
    ],
    exports: [OTPService, OTPRepository]
})
export class OTPModule
{}
