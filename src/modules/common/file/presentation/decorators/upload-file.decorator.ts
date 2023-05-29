import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FileFastifyInterceptor } from 'fastify-file-interceptor';

export function UploadFile(paramName = 'file')
{
    return applyDecorators(
        UseInterceptors(
            FileFastifyInterceptor(paramName)
        )
    );
}
