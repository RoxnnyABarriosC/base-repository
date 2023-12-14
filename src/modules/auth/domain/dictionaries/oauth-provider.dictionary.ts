import { OAuthProviderEnum } from '@modules/auth/domain/enums';

export const OAuthProviderDictionary = new Map([
    ['facebook', OAuthProviderEnum.FACEBOOK],
    ['google', OAuthProviderEnum.GOOGLE],
    ['apple', OAuthProviderEnum.APPLE]
]);
