import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { CriteriaInterceptor } from '@shared/interceptors';

export function Criteria()
{
    return applyDecorators(
        UseInterceptors(CriteriaInterceptor)
    );
}
