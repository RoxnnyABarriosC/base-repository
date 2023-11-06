import { SendMessageEvent } from '@modules/otp/domain/events/send-message.event';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { TwilioService as _TwilioService } from 'nestjs-twilio/dist/module/twilio.service';

export enum TwilioEventEnum {
    SEND_MESSAGE = 'twilio.send.message',
}

@Injectable()
export class TwilioListener
{
    private readonly logger = new Logger(TwilioListener.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly twilioService: _TwilioService
    )
    { }

    @OnEvent(TwilioEventEnum.SEND_MESSAGE, { async: true })
    async handleSendMessage({ to, message }: SendMessageEvent)
    {
        this.logger.log('Send messages twilio');
        await this.twilioService.client.messages.create({
            body: message,
            from: this.configService.get<string>('twilio.fromNumber'),
            to
        });
    }
}
