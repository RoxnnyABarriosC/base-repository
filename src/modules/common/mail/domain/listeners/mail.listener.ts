import {
    ChangeForgotPasswordEvent,
    ForgotPasswordEvent,
    VerifiedAccountEvent,
    VerifyAccountEvent
} from '@modules/common/mail/domain/events';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { MailerService } from '@nestjs-modules/mailer';


export enum MailEventEnum {
    VERIFY_ACCOUNT ='mail.verify.account',
    VERIFIED_ACCOUNT ='mail.verified.account',
    FORGOT_PASSWORD ='mail.forgot.password',
    CHANGE_FORGOT_PASSWORD ='mail.change.forgot.password',
}

@Injectable()
export class MailListener
{
    private readonly logger = new Logger(MailListener.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly mailerService: MailerService
    )
    { }

    @OnEvent(MailEventEnum.VERIFY_ACCOUNT, { async: true })
    async handleVerifyAccountEvent({ user, urlConfirmationToken }: VerifyAccountEvent)
    {
        try
        {
            await this.mailerService.sendMail({
                to: user.email,
                subject: 'Welcome to Base Repository! Verify your Email',
                template: 'mail/auth/verify-account', // `.hbs` extension is appended automatically
                context: { // ✏️ filling curly brackets with content
                    fullName: user.FullName,
                    urlConfirmationToken,
                    urlWeb: this.configService.getOrThrow('server.url.web'),
                    urlApi: this.configService.getOrThrow('server.url.api'),
                    emailSupport: this.configService.getOrThrow('smtp.emails.default')
                }
            });
        }
        catch (error)
        {
            this.logger.error(error);
        }
    }

    @OnEvent(MailEventEnum.VERIFIED_ACCOUNT, { async: true })
    async handleVerifiedAccountEvent({ user }: VerifiedAccountEvent)
    {
        try
        {
            await this.mailerService.sendMail({
                to: user.email,
                subject: 'Welcome to Base Repository! you can now log in',
                template: './mail/auth/verified-account', // `.hbs` extension is appended automatically
                context: { // ✏️ filling curly brackets with content
                    fullName: user.FullName,
                    urlWeb: this.configService.getOrThrow('server.url.web'),
                    urlApi: this.configService.getOrThrow('server.url.api'),
                    emailSupport: this.configService.getOrThrow('smtp.emails.default')
                }
            });
        }
        catch (error)
        {
            this.logger.error(error);
        }
    }

    @OnEvent(MailEventEnum.FORGOT_PASSWORD, { async: true })
    async handleForgotPasswordEvent({ user, urlConfirmationToken }: ForgotPasswordEvent)
    {
        try
        {
            await this.mailerService.sendMail({
                to: user.email,
                subject: 'Change your password',
                template: './mail/auth/forgot-password', // `.hbs` extension is appended automatically
                context: { // ✏️ filling curly brackets with content
                    fullName: user.FullName,
                    urlConfirmationToken,
                    urlWeb: this.configService.getOrThrow('server.url.web'),
                    urlApi: this.configService.getOrThrow('server.url.api'),
                    emailSupport: this.configService.getOrThrow('smtp.emails.default')
                }
            });
        }
        catch (error)
        {
            this.logger.error(error);
        }
    }

    @OnEvent(MailEventEnum.CHANGE_FORGOT_PASSWORD, { async: true })
    async handleChangeForgotPasswordEvent({ user }: ChangeForgotPasswordEvent)
    {
        try
        {
            await this.mailerService.sendMail({
                to: user.email,
                subject: 'Your password has been successfully updated',
                template: './mail/auth/updated-password', // `.hbs` extension is appended automatically
                context: { // ✏️ filling curly brackets with content
                    fullName: user.FullName,
                    urlWeb: this.configService.getOrThrow('server.url.web'),
                    urlApi: this.configService.getOrThrow('server.url.api'),
                    emailSupport: this.configService.getOrThrow('smtp.emails.default')
                }
            });
        }
        catch (error)
        {
            this.logger.error(error);
        }
    }
}
