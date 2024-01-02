import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

export const ArraySet = () =>
{
    return applyDecorators(Transform(({ value }) =>
    {
        if (value === undefined || value === null)
        {
            return value;
        }

        if (!Array.isArray(value))
        {
            return [value];
        }

        return [...new Set(value)];
    }));
};
