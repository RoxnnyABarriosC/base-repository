import { applyDecorators } from '@nestjs/common';
import { Expose, Transform, TransformFnParams } from 'class-transformer';

export const RenameProperty = (name: string) =>
{
    return applyDecorators(
        Transform(({ key, obj, value }: TransformFnParams) =>
        {
            if (value !== null && value !== undefined)
            {
                return value;
            }

            return obj[key];
        }),
        Expose({ name, toClassOnly: true, toPlainOnly: true })
    );
};
