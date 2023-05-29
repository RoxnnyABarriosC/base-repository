import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FileFieldsFastifyInterceptor } from 'fastify-file-interceptor';
import { Field } from 'multer';

export function UploadFileFields(fields: ReadonlyArray<Field>)
{
    return applyDecorators(
        UseInterceptors(
            FileFieldsFastifyInterceptor(fields)
        )
    );
}
