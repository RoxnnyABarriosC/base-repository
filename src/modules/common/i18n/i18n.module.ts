import { i18nFactory } from '@modules/common/i18n/infrastructure/factories';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AcceptLanguageResolver, QueryResolver, I18nModule as _I18nModule } from 'nestjs-i18n';

@Module({
    imports: [
        _I18nModule.forRootAsync({
            inject: [ConfigService],
            useFactory: i18nFactory,
            logging: true,
            resolvers: [
                new QueryResolver(['lang']),
                AcceptLanguageResolver
            ]
        })
    ]
})
export class I18nModule
{}
