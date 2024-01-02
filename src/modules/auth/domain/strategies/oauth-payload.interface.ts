import { RegisterDto } from '@modules/auth/presentation/dtos';
import { OAuthProviderEnum } from '../enums';

export interface IOAuthPayload {
    dto: Partial<RegisterDto>,
    accessToken: string;
    accountId: string;
    provider: OAuthProviderEnum;
}
