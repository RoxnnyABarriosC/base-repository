import { MimeTypeEnum } from '@modules/common/file/domain/enums';
import { HttpException, HttpStatus, UseInterceptors, applyDecorators } from '@nestjs/common';
import { megabytesToBytes } from '@shared/utils';
import { FileFieldsFastifyInterceptor } from 'fastify-file-interceptor';
import { Field } from 'multer';

interface Props {
    fields: ReadonlyArray<Field>;
    fileType?: MimeTypeEnum | MimeTypeEnum[];
    maxSize?: number; // In MegaByte
    validate?: boolean
}

export function UploadFileFields({ fields, fileType, maxSize = 10, validate = false }: Props)
{
    return applyDecorators(
        UseInterceptors(
            FileFieldsFastifyInterceptor(fields, {
                limits: validate ? {
                    fileSize: megabytesToBytes(maxSize)
                } : undefined,
                fileFilter: validate ? function fileFilter(req, file, cb)
                {
                    if (fileType.length && !fileType.includes(file.mimetype as any))
                    {
                        // @ts-ignore
                        cb(new HttpException(`${file.originalname} file is not allowed`, HttpStatus.BAD_REQUEST), false);
                    }

                    cb(null, true);
                } : undefined
            })
        )
    );
}
