import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export const DefaultValue = <T=any>(defaultValue: T) =>
{
    return applyDecorators(IsOptional(), Transform(({ value }) =>
    {
        if (!value)
        {
            return defaultValue;
        }

        return value;
    }));
};
