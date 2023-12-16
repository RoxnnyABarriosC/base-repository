import { OAuthProviderEnum } from '../enums';

export const OAuthAccountPropertiesDictionary = new Map([
    [OAuthProviderEnum.FACEBOOK, 'facebookAccountId'],
    [OAuthProviderEnum.GOOGLE, 'googleAccountId'],
    [OAuthProviderEnum.APPLE, 'appleAccountId']
]);
