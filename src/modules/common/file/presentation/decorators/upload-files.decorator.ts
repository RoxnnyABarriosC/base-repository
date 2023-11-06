import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FilesFastifyInterceptor } from 'fastify-file-interceptor';

interface IUploadFilesProps  {
    paramName?: string;
    limit?: number;
}

export function UploadFiles({ paramName = 'files', limit = 5 }: IUploadFilesProps = {})
{
    return applyDecorators(
        UseInterceptors(
            FilesFastifyInterceptor(paramName, limit)
        )
    );
}
