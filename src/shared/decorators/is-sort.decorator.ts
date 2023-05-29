import { applyDecorators } from '@nestjs/common';
import { SortEnum } from '@shared/enums';
import { IsEnum, IsOptional } from 'class-validator';

export function IsSort()
{
    return applyDecorators(IsOptional(), IsEnum(SortEnum));
}
