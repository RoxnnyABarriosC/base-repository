import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';
import { SerializerInterceptor } from '@shared/interceptors';

export const SCOPE_SERIALIZER_GROUPS = 'scope_serializer_groups';
export const SetScopeSerializerGroups = (...groups: string[]) => SetMetadata(SCOPE_SERIALIZER_GROUPS, groups);

export const GROUP_SERIALIZER_METHOD = 'group_serializer_method';
export const SetMethodToUseGroupSerializer = (method: 'combine' | 'replace') => SetMetadata(GROUP_SERIALIZER_METHOD, method);

export function SetSerializerGroups(...groups: string[])
{
    return applyDecorators(
        SetScopeSerializerGroups(...groups),
        UseInterceptors(SerializerInterceptor)
    );
}
