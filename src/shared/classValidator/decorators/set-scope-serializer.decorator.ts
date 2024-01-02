import { SetMetadata } from '@nestjs/common';

export const SCOPE_SERIALIZER = 'scope_serializer';
export const SetScopeSerializer = (scope: string) => SetMetadata(SCOPE_SERIALIZER, scope);
