import { applyDecorators } from '@nestjs/common';
import { NotEquals, ValidateIf } from 'class-validator';
import { ValidationOptions } from 'class-validator/types/decorator/ValidationOptions';

export function ValidateIfPropertyExists(options: ValidationOptions = {})
{
    return applyDecorators(
        NotEquals(null, options),
        ValidateIf((object, value) => value !== undefined, options)
    );
}
