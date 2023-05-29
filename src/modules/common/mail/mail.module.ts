import { MailListener } from '@modules/common/mail/domain/listeners';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import HandlebarsHelper from 'handlebars-helpers';
import { join } from 'path';

@Module({
    imports: [
        MailerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService): MailerOptions =>
            {
                const auth = {
                    auth: {
                        user: config.get('smtp.username'),
                        pass: config.get('smtp.password')
                    }
                };

                const data = (auth?.auth?.user && auth?.auth?.pass) ? auth : {};

                const adapter = new HandlebarsAdapter();

                return {
                    transport: {
                        host: config.get('smtp.host'),
                        secure: config.get('smtp.secure'),
                        port: config.get('smtp.port'),
                        ...data
                    },
                    defaults: {
                        from: `"Support Team" ${config.get('smtp.emails.default')}`
                    },
                    template: {
                        dir: join(__dirname, 'presentation/templates'),
                        adapter,
                        options: {
                            strict: true,
                            helpers: HandlebarsHelper()
                        }
                    }
                };
            }
        })
    ],
    providers: [MailListener],
    exports: [] // 👈 export for DI
})
export class MailModule
{}
