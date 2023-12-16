import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { IOAuthStrategyConfig } from '@src/config';
import { Profile, Strategy } from 'passport-facebook';
import { OAuthProviderDictionary } from '../dictionaries';
import { IOAuthPayload } from '../strategies';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook')
{
    private readonly logger = new Logger(FacebookStrategy.name);

    constructor(
        private readonly configService: ConfigService
    )
    {
        super({
            ... configService.getOrThrow<IOAuthStrategyConfig>('facebookStrategy'),
            scope: 'email',
            profileFields: ['id', 'email', 'name']
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
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
