import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { IAppleStrategyConfig } from '@src/config';
import Strategy from 'passport-apple';
import { IOAuthPayload } from './index';
import { OAuthProviderDictionary } from '../dictionaries';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple')
{
    private readonly logger = new Logger(AppleStrategy.name);

    constructor(
        private readonly configService: ConfigService
    )
    {
        super({

            ... configService.getOrThrow<IAppleStrategyConfig>('appleStrategy'),
            passReqToCallback: true

        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: (err: any, user: any, info?: any) => void
    ): Promise<void>
    {
        const payload: IOAuthPayload = {
            dto: {
                email: profile.emails[0].value,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                birthday: null,
                gender: null,
                phone: null
            },
            accountId: profile.id,
            provider: OAuthProviderDictionary.get(profile.provider),
            accessToken
        };

        done(null, payload);
    }
}
