import { MimeTypeEnum } from '@modules/common/file/domain/enums';
import { FileValidator as _FileValidator } from '@nestjs/common';
import { BadRequestCustomException } from '@shared/app/exceptions';
import { megabytesToBytes } from '@shared/utils';
import { MulterFile } from 'fastify-file-interceptor';

export interface IValidatorOptions
{
    maxSize?: number;
    fileType?: MimeTypeEnum | MimeTypeEnum[];
}

export class FileValidator extends _FileValidator<IValidatorOptions>
{
    private errors = [];
    buildErrorMessage(file: any): string
    {
        if (this.errors.length)
        {
            throw new BadRequestCustomException(this.errors);
        }

        return;
    }

    isValid<TFile>(file: TFile | MulterFile): boolean | Promise<boolean>
    {
        const { fileType, maxSize = 10 } = this.validationOptions;

        this.errors = [];

        const error = {
            property: file['fieldname'],
            fileName: file['originalname'],
            constraints: { }
        };

        if (fileType?.length && !fileType.includes(file['mimetype'] as any))
        {
            error.constraints['fileType'] = `The filetype of "${file['fieldname']}" field is not in the allowed options: ${fileType}`;
        }

        if (maxSize && file['size'] > megabytesToBytes(maxSize))
        {
            error.constraints['maxSize'] = `File size exceeds ${maxSize}Mb`;
        }

        if (Object.keys(error.constraints).length)
        {
            this.errors.push(error);
        }

        return !this.errors.length;
    }
}
