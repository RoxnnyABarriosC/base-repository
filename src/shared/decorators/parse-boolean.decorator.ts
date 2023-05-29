import { applyDecorators } from '@nestjs/common';
import { Parse } from '@shared/utils';
import { Transform } from 'class-transformer';

export function ParseBoolean()
{
    return applyDecorators(
        Transform(({ value }) =>
        {
            return Parse(value);
        })
    );
}
