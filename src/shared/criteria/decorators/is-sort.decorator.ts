import { applyDecorators } from '@nestjs/common';
import { IsEnum, IsOptional } from 'class-validator';
import { SortEnum } from '../enums';

export const IsSort = () =>
{
    return applyDecorators(IsOptional(), IsEnum(SortEnum));
};
