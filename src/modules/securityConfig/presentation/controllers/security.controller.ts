import { AuthUser, Protected } from '@modules/auth/presentation/decorators';
import { SCOPE } from '@modules/securityConfig/domain/constants';
import { OTPTargetConfigEnum } from '@modules/securityConfig/domain/enums';
import {
    EnableOrDisableOTPUseCase, EnableOrDisableRequiredPasswordUseCase, GetFormConfigUseCase,
    SetPhoneOTPProvidersUseCase
} from '@modules/securityConfig/domain/useCases';
import { User } from '@modules/user/domain/entities';
import { EmailOrPhone } from '@modules/user/presentation/decorators';
import {
    Body,
    Controller, Get,
    HttpCode,
    HttpStatus,
    Logger,
    Param, ParseEnumPipe, Patch
} from '@nestjs/common';
import { Public, SkipCache } from '@shared/app/decorators';
import { SetScopeSerializer, SetSerializerGroups } from '@shared/classValidator/decorators';
import { SerializerGroupsEnum } from '@shared/classValidator/enums';
import { Serializer } from '@shared/classValidator/utils';
import { Bool } from '@shared/decorators';
import { SetProvidersDto } from '../dtos';
import { SecurityConfigSerializerGroupsEnum } from '../enums';
import { OtpUserConfigSerializer, SecurityConfigSerializer } from '../serializers';

@Controller({
    path: 'security',
    version: '1'
})
@Protected()
@SetScopeSerializer(SCOPE)
export class SecurityController
{
    private readonly logger = new Logger(SecurityController.name);

    constructor(
        private readonly enableOrDisableUseCase: EnableOrDisableOTPUseCase,
        private readonly setPhoneProvidersUseCase: SetPhoneOTPProvidersUseCase,
        private readonly getFormConfigUseCase: GetFormConfigUseCase,
        private readonly enableOrDisableRequiredPasswordUseCase: EnableOrDisableRequiredPasswordUseCase
    )
    {}

    @Get('config')
    @HttpCode(HttpStatus.OK)
    @SetSerializerGroups(
        SerializerGroupsEnum.ONLY_ID,
        SecurityConfigSerializerGroupsEnum.ALL
    )
    @SkipCache()
    async get(
        @AuthUser() authUser: User
    )
    {
        this.logger.log('Processing get security config request...');

        return (await Serializer(await authUser.securityConfig, SecurityConfigSerializer)) as typeof SecurityConfigSerializer;
    }

    @Patch('required-password/enable/:enable')
    @HttpCode(HttpStatus.OK)
    async enableOrDisableRequiredPassword(
      @AuthUser() authUser: User,
      @Bool() enable: boolean
    )
    {
        this.logger.log('Processing enable or disable requiredPassword otp request...');

        return await this.enableOrDisableRequiredPasswordUseCase
            .handle({
                authUser,
                enable
            });
    }

    @Patch('otp/phone/providers')
    @HttpCode(HttpStatus.OK)
    async setProviders(
      @AuthUser() authUser: User,
      @Body() dto: SetProvidersDto
    )
    {
        this.logger.log('Processing set providers phone otp request...');

        return await this.setPhoneProvidersUseCase
            .handle({
                authUser,
                dto
            });
    }

    @Patch('otp/:target/enable/:enable')
    @HttpCode(HttpStatus.OK)
    async enableOrDisable(
        @AuthUser() authUser: User,
        @Bool() enable: boolean,
        @Param('target', new ParseEnumPipe(OTPTargetConfigEnum)) target: string
    )
    {
        this.logger.log(`Processing enable or disable ${target} otp request...`);

        return await this.enableOrDisableUseCase
            .handle({
                authUser,
                enable,
                target: target as OTPTargetConfigEnum
            });
    }

    @Get('otp/config/:emailOrPhone')
    @HttpCode(HttpStatus.OK)
    @SkipCache()
    @Public()
    async config(
      @EmailOrPhone() emailOrPhone: string
    )
    {
        this.logger.log('Processing get otp config request...');

        const data  = await this.getFormConfigUseCase.handle({ emailOrPhone });

        return (await Serializer(data, OtpUserConfigSerializer)) as typeof OtpUserConfigSerializer;
    }
}
