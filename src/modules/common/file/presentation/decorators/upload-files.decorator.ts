import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FilesFastifyInterceptor } from 'fastify-file-interceptor';

export function UploadFiles(paramName = 'files', limit = 5)
{
    return applyDecorators(
        UseInterceptors(
            FilesFastifyInterceptor(paramName, limit)
        )
    );
}
