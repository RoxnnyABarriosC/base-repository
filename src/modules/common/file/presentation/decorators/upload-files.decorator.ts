import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FilesFastifyInterceptor } from 'fastify-file-interceptor';

interface Props  {
    paramName?: string;
    limit?: number;
}

export function UploadFiles({ paramName = 'files', limit = 5 }: Props = {})
{
    return applyDecorators(
        UseInterceptors(
            FilesFastifyInterceptor(paramName, limit)
        )
    );
}
