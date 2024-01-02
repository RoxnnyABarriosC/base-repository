import { SetMetadata, UsePipes, applyDecorators } from '@nestjs/common';
import { ValidationPipe } from '../pipes';

export const SCOPE_PIPE_GROUPS = 'scope_pipe_groups';

export function SetPipeGroups(...groups: string[])
{
    return applyDecorators(
        SetMetadata(SCOPE_PIPE_GROUPS, groups),
        UsePipes(ValidationPipe(...groups))
    );
}
