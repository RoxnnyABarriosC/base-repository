import { OAuthProviderEnum } from '@modules/auth/domain/enums';
import { RegisterDto } from '@modules/auth/presentation/dtos';

export interface IOAuthPayload {
    dto: Partial<RegisterDto>,
    accessToken: string;
    accountId: string;
    provider: OAuthProviderEnum;
}
