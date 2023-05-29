import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

export function ArraySet()
{
    return applyDecorators(Transform(({ value }) =>
    {
        return [...new Set(value)];
    }));
}
