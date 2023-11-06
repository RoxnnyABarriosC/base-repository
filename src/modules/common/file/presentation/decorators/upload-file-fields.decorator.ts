import {  UseInterceptors, applyDecorators } from '@nestjs/common';
import { FileFieldsFastifyInterceptor } from 'fastify-file-interceptor';
import { Field } from 'multer';

interface IUploadFileFieldsProps {
    fields: ReadonlyArray<Field>;
}

export function UploadFileFields({ fields }: IUploadFileFieldsProps)
{
    return applyDecorators(
        UseInterceptors(
            FileFieldsFastifyInterceptor(fields)
        )
    );
}
