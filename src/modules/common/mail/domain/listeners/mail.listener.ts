import {
    ActivateAccountEvent,
    ActivatedAccountEvent,
    ChangeForgotPasswordEvent,
    ForgotPasswordEvent, ResetPasswordEvent, SendOtpEvent
} from '@modules/common/mail/domain/events';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { MailerService } from '@nestjs-modules/mailer';


export enum MailEventEnum {
    ACTIVATE_ACCOUNT ='mail.activate.account',
    ACTIVATED_ACCOUNT ='mail.activated.account',
    FORGOT_PASSWORD ='mail.forgot.password',
    CHANGE_FORGOT_PASSWORD ='mail.change.forgot.password',
    RESET_PASSWORD ='mail.reset.password',
    SEND_OTP = 'mail.send.otp',
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

    @OnEvent(MailEventEnum.ACTIVATE_ACCOUNT, { async: true })
    async handleActivateAccountEvent({ user, urlConfirmationToken }: ActivateAccountEvent)
    {
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Welcome to Base Repository! Confirm your Email',
            template: './mail/auth/activate-account', // `.hbs` extension is appended automatically
            context: { // ✏️ filling curly brackets with content
                fullName: user.FullName,
                urlConfirmationToken,
                urlWeb: this.configService.get('server.url.web'),
                urlApi: this.configService.get('server.url.api'),
                emailSupport: this.configService.get('smtp.emails.default')
            }
        });
    }

    @OnEvent(MailEventEnum.ACTIVATED_ACCOUNT, { async: true })
    async handleActivatedAccountEvent({ user }: ActivatedAccountEvent)
    {
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Welcome to Base Repository! you can now log in',
            template: './mail/auth/activated-account', // `.hbs` extension is appended automatically
            context: { // ✏️ filling curly brackets with content
                fullName: user.FullName,
                urlWeb: this.configService.get('server.url.web'),
                urlApi: this.configService.get('server.url.api'),
                emailSupport: this.configService.get('smtp.emails.default')
            }
        });
    }

    @OnEvent(MailEventEnum.FORGOT_PASSWORD, { async: true })
    async handleForgotPasswordEvent({ user, urlConfirmationToken }: ForgotPasswordEvent)
    {
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Change your password',
            template: './mail/auth/forgot-password', // `.hbs` extension is appended automatically
            context: { // ✏️ filling curly brackets with content
                fullName: user.FullName,
                urlConfirmationToken,
                urlWeb: this.configService.get('server.url.web'),
                urlApi: this.configService.get('server.url.api'),
                emailSupport: this.configService.get('smtp.emails.default')
            }
        });
    }

    @OnEvent(MailEventEnum.CHANGE_FORGOT_PASSWORD, { async: true })
    async handleChangeForgotPasswordEvent({ user }: ChangeForgotPasswordEvent)
    {
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Your password has been successfully updated',
            template: './mail/auth/updated-password', // `.hbs` extension is appended automatically
            context: { // ✏️ filling curly brackets with content
                fullName: user.FullName,
                urlWeb: this.configService.get('server.url.web'),
                urlApi: this.configService.get('server.url.api'),
                emailSupport: this.configService.get('smtp.emails.default')
            }
        });
    }

    @OnEvent(MailEventEnum.RESET_PASSWORD, { async: true })
    async handleResetPasswordEvent({ user, newPassword, urlConfirmationToken }: ResetPasswordEvent)
    {
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Please change your password',
            template: './mail/auth/reset-password', // `.hbs` extension is appended automatically
            context: { // ✏️ filling curly brackets with content
                fullName: user.FullName,
                newPassword,
                urlConfirmationToken,
                urlWeb: this.configService.get('server.url.web'),
                urlApi: this.configService.get('server.url.api'),
                emailSupport: this.configService.get('smtp.emails.default')
            }
        });
    }

    @OnEvent(MailEventEnum.SEND_OTP, { async: true })
    async handleSendOtpEvent({ user, otp }: SendOtpEvent)
    {
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Verification code',
            template: './mail/otp/send-otp', // `.hbs` extension is appended automatically
            context: { // ✏️ filling curly brackets with content
                fullName: user.FullName,
                otp,
                urlWeb: this.configService.get('server.url.web'),
                urlApi: this.configService.get('server.url.api'),
                emailSupport: this.configService.get('smtp.emails.default')
            }
        });
    }
}
