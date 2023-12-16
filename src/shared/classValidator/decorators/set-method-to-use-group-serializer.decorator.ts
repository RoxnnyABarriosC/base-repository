import { SetMetadata } from '@nestjs/common';

export const GROUP_SERIALIZER_METHOD = 'group_serializer_method';
export const SetMethodToUseGroupSerializer = (method: 'combine' | 'replace') => SetMetadata(GROUP_SERIALIZER_METHOD, method);
