import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

export function ParseNumber()
{
    return applyDecorators(Transform(({ value }) =>
    {
        return parseFloat(value);
    }));
}
