import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { SerializerInterceptor } from '../interceptors';
import { SetScopeSerializerGroups } from './set-scope-serializer-groups.decorator';


export function SetSerializerGroups(...groups: string[])
{
    return applyDecorators(
        SetScopeSerializerGroups(...groups),
        UseInterceptors(SerializerInterceptor)
    );
}
