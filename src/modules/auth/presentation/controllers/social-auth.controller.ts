import { IOAuthPayload } from '@modules/auth/domain/strategies';
import { OAuthLoginUseCase } from '@modules/auth/domain/useCases';
import { IMyStore } from '@modules/common/store';
import { RoleSerializerGroupsEnum } from '@modules/role/presentation/enums';
import { SCOPE } from '@modules/user/domain/constants';
import { UserSerializerGroupsEnum } from '@modules/user/presentation/enums';
import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Logger,
    Req,
    Res
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Agent, UserAgent } from '@shared/app/decorators';
import { SendLocalMessage, SendRefresh } from '@shared/app/utils';
import { SetScopeSerializer, SetSerializerGroups } from '@shared/classValidator/decorators';
import { Serializer } from '@shared/classValidator/utils';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ClsService } from 'nestjs-cls';
import {
    AppleAuth,
    FacebookAuth, GoogleAuth,
    OauthPayload
} from '../decorators';
import { AuthSerializer } from '../serializers';
dayjs.extend(utc);

@Controller({
    path: 'auth',
    version: '1'
})
@SetScopeSerializer(SCOPE)
export class SocialAuthController
{
    private readonly logger = new Logger(SocialAuthController.name);

    constructor(
        private readonly store: ClsService<IMyStore>,
        private readonly configService: ConfigService,
        private readonly oAuthLoginUseCase: OAuthLoginUseCase
    )
    { }

    @Get('facebook')
    @FacebookAuth()
    @HttpCode(HttpStatus.CREATED)
    async loginFacebook()
    {
        return SendLocalMessage(() => 'messages.oAuth.facebook');
    }

    @Get('facebook/callback')
    @FacebookAuth()
    @HttpCode(HttpStatus.CREATED)
    @SetSerializerGroups(
        UserSerializerGroupsEnum.WITH_ROLES,
        UserSerializerGroupsEnum.WITH_PERMISSIONS,
        RoleSerializerGroupsEnum.ONLY_ID
    )
    async registerFacebook(
      @Req() req: FastifyRequest,
      @Res({ passthrough: true }) res: FastifyReply,
      @OauthPayload() payload: IOAuthPayload,
      @UserAgent() agent: Agent
    )
    {
        const data = await this.oAuthLoginUseCase.handle(payload);

        SendRefresh({
            res,
            agent,
            configService: this.configService,
            store: this.store,
            refreshHash: data.RefreshHash,
            expiresRefresh: data.ExpiresRefresh
        });

        return (await Serializer(data, AuthSerializer)) as typeof AuthSerializer;
    }

    @Get('google')
    @GoogleAuth()
    @HttpCode(HttpStatus.CREATED)
    async loginGoogle()
    {
        return SendLocalMessage(() => 'messages.oAuth.google');
    }

    @Get('google/callback')
    @GoogleAuth()
    @HttpCode(HttpStatus.CREATED)
    @SetSerializerGroups(
        UserSerializerGroupsEnum.WITH_ROLES,
        UserSerializerGroupsEnum.WITH_PERMISSIONS,
        RoleSerializerGroupsEnum.ONLY_ID
    )
    async registerGoogle(
      @Req() req: FastifyRequest,
      @Res({ passthrough: true }) res: FastifyReply,
      @OauthPayload() payload: IOAuthPayload,
      @UserAgent() agent: Agent
    )
    {
        const data = await this.oAuthLoginUseCase.handle(payload);

        SendRefresh({
            res,
            agent,
            configService: this.configService,
            store: this.store,
            refreshHash: data.RefreshHash,
            expiresRefresh: data.ExpiresRefresh
        });

        return (await Serializer(data, AuthSerializer)) as typeof AuthSerializer;
    }

    @Get('apple')
    @AppleAuth()
    @HttpCode(HttpStatus.CREATED)
    async loginApple()
    {
        return SendLocalMessage(() => 'messages.oAuth.apple');
    }

    @Get('apple/callback')
    @AppleAuth()
    @HttpCode(HttpStatus.CREATED)
    @SetSerializerGroups(
        UserSerializerGroupsEnum.WITH_ROLES,
        UserSerializerGroupsEnum.WITH_PERMISSIONS,
        RoleSerializerGroupsEnum.ONLY_ID
    )
    async registerApple(
      @Req() req: FastifyRequest,
      @Res({ passthrough: true }) res: FastifyReply,
      @OauthPayload() payload: IOAuthPayload,
      @UserAgent() agent: Agent
    )
    {
        const data = await this.oAuthLoginUseCase.handle(payload);

        SendRefresh({
            res,
            agent,
            configService: this.configService,
            store: this.store,
            refreshHash: data.RefreshHash,
            expiresRefresh: data.ExpiresRefresh
        });

        return (await Serializer(data, AuthSerializer)) as typeof AuthSerializer;
    }
}
