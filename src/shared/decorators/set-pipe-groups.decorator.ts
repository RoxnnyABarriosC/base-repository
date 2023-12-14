import { SetMetadata, UsePipes, applyDecorators } from '@nestjs/common';
import { ValidationPipe } from '@shared/pipes';

export const SCOPE_PIPE_GROUPS = 'scope_pipe_groups';
export const SetScopePipeGroups = (...groups: string[]) => SetMetadata(SCOPE_PIPE_GROUPS, groups);

export function SetPipeGroups(...groups: string[])
{
    return applyDecorators(
        SetScopePipeGroups(...groups),
        UsePipes(ValidationPipe(...groups))
    );
}
