import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyOptions } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { SortEnum } from '../enums';

export const ApiQuerySort = (options?: Omit<ApiPropertyOptions, 'name' | 'enum'>) =>
{
    return (target: string, propertyKey: string) =>
    {
        ApiProperty({ ...options, name: `sort[${propertyKey}]`, enum: SortEnum })(target, propertyKey);
    };
};
