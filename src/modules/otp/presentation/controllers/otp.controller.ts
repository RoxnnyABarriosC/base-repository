import { AuthUser, LocalAuth, Protected } from '@modules/auth/presentation/decorators';
import { LoginDto } from '@modules/auth/presentation/dtos/login.dto';
import { SCOPE } from '@modules/otp/domain/constants';
import {
    EnableOrDisableOtpUseCase,
    SendOtpUseCase,
    SetPhoneOtpProvidersOtpUseCase
} from '@modules/otp/domain/useCases';
import { SetProvidersDto } from '@modules/otp/presentation/dtos';
import { OTPSerializerGroupsEnum } from '@modules/otp/presentation/enums';
import { OTPSerializer } from '@modules/otp/presentation/serializers';
import { User } from '@modules/user/domain/entities';
import {
    Body,
    Controller, Get,
    HttpCode,
    HttpStatus,
    Logger,
    Param, ParseEnumPipe, Patch,
    Post
} from '@nestjs/common';
import { SerializerGroupsEnum } from '@shared/abstractClass';
import { Bool, SetSerializerGroups } from '@shared/decorators';
import { SetScopeSerializer, SkipCache } from '@shared/interceptors';
import { Serializer } from '@shared/utils';
import { OtpTypeEnum } from '../../domain/enums';

@Controller({
    path: 'otp',
    version: '1'
})
@SetScopeSerializer(SCOPE)
export class OTPController
{
    private readonly logger = new Logger(OTPController.name);

    constructor(
        private readonly saveUseCase: SendOtpUseCase,
        private readonly enableOrDisableUseCase: EnableOrDisableOtpUseCase,
        private readonly setPhoneProvidersUseCase: SetPhoneOtpProvidersOtpUseCase
    )
    {}

    @Get()
    @Protected()
    @HttpCode(HttpStatus.OK)
    @SetSerializerGroups(
        SerializerGroupsEnum.ONLY_ID,
        OTPSerializerGroupsEnum.ALL
    )
    @SkipCache()
    async get(
        @AuthUser() authUser: User
    )
    {
        this.logger.log('Processing get otp request...');

        return (await Serializer(await authUser.otp, OTPSerializer)) as typeof OTPSerializer;
    }

    @Post(':target')
    @LocalAuth()
    @HttpCode(HttpStatus.CREATED)
    async save(
        @Body() dto: LoginDto,
        @AuthUser() authUser: User,
        @Param('target', new ParseEnumPipe(OtpTypeEnum)) target: string
    )
    {
        this.logger.log('Processing save otp request...');

        return await this.saveUseCase.handle({ target: target as OtpTypeEnum, user: authUser });
    }

    @Patch('phone/providers')
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

    @Patch(':target/enable-or-disable/:enable')
    @Protected()
    @HttpCode(HttpStatus.OK)
    async enableOrDisable(
        @AuthUser() authUser: User,
        @Bool() enable: boolean,
        @Param('target', new ParseEnumPipe(OtpTypeEnum)) target: string
    )
    {
        this.logger.log(`Processing enable or disable ${target} otp request...`);

        return await this.enableOrDisableUseCase
            .handle({
                authUser,
                enable,
                target: target as OtpTypeEnum
            });
    }
}
