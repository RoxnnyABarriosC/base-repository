import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyOptions } from '@nestjs/swagger/dist/decorators/api-property.decorator';

export const ApiQueryPaginationLimit = (options?: Omit<ApiPropertyOptions, 'name'>) =>
{
    return applyDecorators(ApiProperty({ ...options, name: 'pagination[limit]' }));
};
