import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { TwilioService as _TwilioService } from 'nestjs-twilio/dist/module/twilio.service';
import { SendOTPEmailEvent, SendOTPPhoneEvent } from '../events';

export enum TwilioEventEnum {
    SEND_OTP_PHONE = 'twilio.send.otp.phone',
    SEND_OTP_EMAIL = 'twilio.send.otp.email',
    SEND_PUBLIC_OTP_EMAIL = 'twilio.send.public.otp.email',
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

    @OnEvent(TwilioEventEnum.SEND_OTP_PHONE, { async: true })
    async handleSendPhoneOTP({ to, channel }: SendOTPPhoneEvent)
    {
        this.logger.log(`Send messages twilio otp ${channel} to ${to}`);

        try
        {
            void await this.twilioService
                .client
                .verify
                .v2
                .services(this.configService.getOrThrow('twilio.otpServiceSid'))
                .verifications
                .create({
                    to,
                    channel
                });
        }
        catch (error)
        {
            this.logger.error(error);
        }
    }

    @OnEvent(TwilioEventEnum.SEND_OTP_EMAIL, { async: true })
    async handleSendEmailOTP({ to, channel, fullName }: SendOTPEmailEvent)
    {
        this.logger.log(`Send messages twilio otp ${channel} to ${to}`);

        try
        {
            void await this.twilioService
                .client
                .verify
                .v2
                .services(this.configService.getOrThrow('twilio.otpServiceSid'))
                .verifications
                .create({
                    to,
                    channel,
                    channelConfiguration: {
                        template_id: this.configService.getOrThrow('sendgridTemplates.otp'),
                        substitutions: {
                            fullName,
                            urlWeb: this.configService.getOrThrow('server.url.web'),
                            urlApi: this.configService.getOrThrow('server.url.api'),
                            emailSupport: this.configService.getOrThrow('smtp.emails.default')
                        }
                    }
                });
        }
        catch (error)
        {
            this.logger.error(error);
        }
    }

    @OnEvent(TwilioEventEnum.SEND_PUBLIC_OTP_EMAIL, { async: true })
    async handleSendPublicEmailOTP({ to, channel }: SendOTPEmailEvent)
    {
        this.logger.log(`Send messages twilio public otp ${channel} to ${to}`);

        try
        {
            void await this.twilioService
                .client
                .verify
                .v2
                .services(this.configService.getOrThrow('twilio.otpServiceSid'))
                .verifications
                .create({
                    to,
                    channel,
                    channelConfiguration: {
                        template_id: this.configService.getOrThrow('sendgridTemplates.publicOTP'),
                        substitutions: {
                            urlWeb: this.configService.getOrThrow('server.url.web'),
                            urlApi: this.configService.getOrThrow('server.url.api'),
                            emailSupport: this.configService.getOrThrow('smtp.emails.default')
                        }
                    }
                });
        }
        catch (error)
        {
            this.logger.error(error);
        }
    }
}
