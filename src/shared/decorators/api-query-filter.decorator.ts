import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyOptions } from '@nestjs/swagger/dist/decorators/api-property.decorator';

export function ApiQueryFilter(options?: Omit<ApiPropertyOptions, 'name'>)
{
    return (target: string, propertyKey: string) =>
    {
        ApiProperty({ ...options, name: `filter[${propertyKey}]` })(target, propertyKey);
    };
}
