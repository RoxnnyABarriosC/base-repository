import { SetMetadata } from '@nestjs/common';

export const SCOPE_SERIALIZER_GROUPS = 'scope_serializer_groups';
export const SetScopeSerializerGroups = (...groups: string[]) => SetMetadata(SCOPE_SERIALIZER_GROUPS, groups);

