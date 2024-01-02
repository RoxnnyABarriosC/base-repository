import { MimeTypeEnum } from '@modules/common/file/domain/enums';
import { FileValidator } from '@nestjs/common';
import { BadRequestCustomException } from '@shared/app/exceptions';
import { megabytesToBytes } from '@shared/utils';
import { MulterFile } from 'fastify-file-interceptor';

export interface IValidatorOptions
{
    fields?: {
        name: string;
        maxSize?: number;
        required?: boolean;
        fileType?: MimeTypeEnum | MimeTypeEnum[];
    }[];
    fileType?: MimeTypeEnum | MimeTypeEnum[];
    maxSize?: number;
}


export class FileFieldsValidator extends FileValidator<IValidatorOptions>
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

    isValid<TFile>(files: TFile | undefined): boolean | Promise<boolean>
    {
        const { fields, fileType, maxSize = 10 } = this.validationOptions;

        this.errors = [];

        if (fields)
        {
            fields.forEach(field =>
            {
                const _files = files[field.name] as MulterFile[];
                const _fileType = field.fileType ?? fileType;
                const _maxSize = field?.maxSize ?? maxSize;
                const _required = field.required ?? true;

                const error = {
                    property: field.name,
                    fileNames: _files.map((f) => f['originalname']),
                    constraints: { }
                };

                const invalidFileTypeIndices = [];
                const invalidSizeIndices = [];

                _files?.forEach((f, index) =>
                {
                    if (_fileType?.length && !_fileType.includes(f.mimetype as any))
                    {
                        invalidFileTypeIndices.push(index);
                    }
                    if (_maxSize && f.size > megabytesToBytes(_maxSize))
                    {
                        invalidSizeIndices.push(index);
                    }
                });

                if (_required && !_files)
                {
                    error.constraints['required'] = 'the file is required';
                }

                if (invalidFileTypeIndices.length)
                {
                    error.constraints['fileType'] = `The filetype of files at indices ${invalidFileTypeIndices} in "${field.name}" field is not in the allowed options: ${_fileType}`;
                }

                if (invalidSizeIndices.length)
                {
                    error.constraints['maxSize'] = `The size of files at indices ${invalidSizeIndices} exceeds ${_maxSize}Mb`;
                }

                if (Object.keys(error.constraints).length)
                {
                    this.errors.push(error);
                }
            });
        }

        return !this.errors.length;
    }
}
