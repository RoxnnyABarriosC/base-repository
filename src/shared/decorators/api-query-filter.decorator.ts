import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyOptions } from '@nestjs/swagger/dist/decorators/api-property.decorator';

export function ApiQueryFilter(options?: Omit<ApiPropertyOptions, 'name'>)
{
    return (target, propertyKey) =>
    {
        ApiProperty({ ...options, name: `filter[${propertyKey}]` })(target, propertyKey);
    };
}
