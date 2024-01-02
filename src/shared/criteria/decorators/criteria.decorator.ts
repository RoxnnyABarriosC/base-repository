import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { CriteriaInterceptor } from '../interceptors';

export function Criteria()
{
    return applyDecorators(
        UseInterceptors(CriteriaInterceptor)
    );
}
