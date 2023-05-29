import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyOptions } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { SortEnum } from '../enums/sort.enum';

export function ApiQuerySort(options?: Omit<ApiPropertyOptions, 'name' | 'enum'>)
{
    return (target, propertyKey) =>
    {
        ApiProperty({ ...options, name: `sort[${propertyKey}]`, enum: SortEnum })(target, propertyKey);
    };
}
