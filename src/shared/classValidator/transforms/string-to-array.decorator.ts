import { applyDecorators } from '@nestjs/common';
import { Parse as _Parse, StringToArray as _StringToArray } from '@shared/utils';
import { Transform } from 'class-transformer';

export const StringToArray = (separator = ',') =>
{
    return applyDecorators(
        Transform(({ value }) => _StringToArray(_Parse(value), separator))
    );
};
