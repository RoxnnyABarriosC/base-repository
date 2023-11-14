import { SCOPE } from '@modules/securityConfig/domain/constants';
import {
    SendOTPUseCase, SendPublicOTPUseCase
} from '@modules/securityConfig/domain/useCases';
import { SendOTPDto } from '@modules/securityConfig/presentation/dtos';
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
import {  UUID } from '@shared/decorators';
import { ThrottleUseUrl } from '@shared/guards';
import { SetScopeSerializer } from '@shared/interceptors';
import { OTPSendTypeEnum } from '../../domain/enums';

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

    @Post(':userId/otp/:target')
    @Throttle(2, 60)
    @ThrottleUseUrl()
    @HttpCode(HttpStatus.CREATED)
    async send(
      @UUID('userId') userId: string,
      @Param('target', new ParseEnumPipe(OTPSendTypeEnum)) target: string
    )
    {
        this.logger.log('Processing send otp request...');

        return await this.sendUseCase.handle({ target: target as OTPSendTypeEnum, userId });
    }

    @Post('public/otp/:target')
    @Throttle(2, 60)
    @ThrottleUseUrl()
    @HttpCode(HttpStatus.CREATED)
    async sendPublic(
      @Body() dto: SendOTPDto,
      @Param('target', new ParseEnumPipe(OTPSendTypeEnum)) target: string
    )
    {
        this.logger.log('Processing send otp request...');

        return await this.sendPublicUseCase.handle({
            target: target as OTPSendTypeEnum,
            dto
        });
    }
}
