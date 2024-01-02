import { SCOPE } from '@modules/securityConfig/domain/constants';
import { OTPSendChannelEnum } from '@modules/securityConfig/domain/enums';
import {
    SendOTPUseCase, SendPublicOTPUseCase
} from '@modules/securityConfig/domain/useCases';
import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Logger,
    Param, ParseEnumPipe,
    Post
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ThrottleUseUrl } from '@shared/app/decorators';
import { SetScopeSerializer } from '@shared/classValidator/decorators';
import {  UUID } from '@shared/decorators';
import { SendOTPDto } from '../dtos';

@Controller({
    version: '1'
})
@SetScopeSerializer(SCOPE)
export class OTPController
{
    private readonly logger = new Logger(OTPController.name);

    constructor(
        private readonly sendUseCase: SendOTPUseCase,
        private readonly sendPublicUseCase: SendPublicOTPUseCase
    )
    {}

    @Post(':userId/otp/:channel')
    @Throttle(5, 60)
    @ThrottleUseUrl()
    @HttpCode(HttpStatus.CREATED)
    async send(
      @UUID('userId') userId: string,
      @Param('channel', new ParseEnumPipe(OTPSendChannelEnum)) channel: string
    )
    {
        this.logger.log('Processing send otp request...');

        return await this.sendUseCase.handle({ channel: channel as OTPSendChannelEnum, userId, countAttempts: true });
    }

    @Post('public/otp')
    @Throttle(5, 60)
    @ThrottleUseUrl()
    @HttpCode(HttpStatus.CREATED)
    async sendPublic(
      @Body() dto: SendOTPDto
    )
    {
        this.logger.log('Processing send otp request...');

        return await this.sendPublicUseCase.handle({ dto });
    }
}
