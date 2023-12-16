import { applyDecorators } from '@nestjs/common';
import { Parse as _Parse } from '@shared/utils';
import { Transform } from 'class-transformer';

export const Parse = () =>
{
    return applyDecorators(
        Transform(({ value }) =>
        {
            return _Parse(value);
        })
    );
};
