import { applyDecorators } from '@nestjs/common';
import { ValidateIfPropertyExists } from '@shared/classValidator/decorators';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { SortEnum } from '../enums';

export const IsSort = () =>
{
    return applyDecorators(
        IsEnum(SortEnum),
        ValidateIfPropertyExists(),
        Transform(({ value }: TransformFnParams) => (value as string)?.toUpperCase() ?? value)
    );
};
