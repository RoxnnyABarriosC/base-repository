import { AuthUser, Protected } from '@modules/auth/presentation/decorators';
import { SCOPE } from '@modules/securityConfig/domain/constants';
import {
    EnableOrDisableOTPUseCase, EnableOrDisableRequiredPasswordUseCase, GetFormConfigUseCase,
    SetPhoneOTPProvidersUseCase
} from '@modules/securityConfig/domain/useCases';
import { SetProvidersDto } from '@modules/securityConfig/presentation/dtos';
import { SecurityConfigSerializerGroupsEnum } from '@modules/securityConfig/presentation/enums';
import { FormConfigSerializer, SecurityConfigSerializer } from '@modules/securityConfig/presentation/serializers';
import { User } from '@modules/user/domain/entities';
import {
    Body,
    Controller, Get,
    HttpCode,
    HttpStatus,
    Logger,
    Param, ParseEnumPipe, Patch
} from '@nestjs/common';
import { SerializerGroupsEnum } from '@shared/abstractClass';
import { Bool, SetSerializerGroups } from '@shared/decorators';
import { SetScopeSerializer, SkipCache } from '@shared/interceptors';
import { Serializer } from '@shared/utils';
import { OTPSendTypeEnum } from '../../domain/enums';

@Controller({
    path: 'security',
    version: '1'
})
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

    @Get()
    @Protected()
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

    @Patch('required-password/enable-or-disable/:enable')
    @Protected()
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
    @Protected()
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

    @Patch('otp/:target/enable-or-disable/:enable')
    @Protected()
    @HttpCode(HttpStatus.OK)
    async enableOrDisable(
        @AuthUser() authUser: User,
        @Bool() enable: boolean,
        @Param('target', new ParseEnumPipe(OTPSendTypeEnum)) target: string
    )
    {
        this.logger.log(`Processing enable or disable ${target} otp request...`);

        return await this.enableOrDisableUseCase
            .handle({
                authUser,
                enable,
                target: target as OTPSendTypeEnum
            });
    }

    @Get('form-config/:emailOrPhone')
    @HttpCode(HttpStatus.OK)
    @SkipCache()
    async formConfig(
      @Param('emailOrPhone') emailOrPhone: string
    )
    {
        this.logger.log('Processing get form config request...');

        const data  = await this.getFormConfigUseCase.handle({ emailOrPhone });

        return (await Serializer(data, FormConfigSerializer)) as typeof FormConfigSerializer;
    }
}
