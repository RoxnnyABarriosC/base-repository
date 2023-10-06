import {  UseInterceptors, applyDecorators } from '@nestjs/common';
import { FileFieldsFastifyInterceptor } from 'fastify-file-interceptor';
import { Field } from 'multer';

interface Props {
    fields: ReadonlyArray<Field>;
}

export function UploadFileFields({ fields }: Props)
{
    return applyDecorators(
        UseInterceptors(
            FileFieldsFastifyInterceptor(fields)
        )
    );
}
