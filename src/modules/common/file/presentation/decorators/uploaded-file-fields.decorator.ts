import { ParseFilePipe, UploadedFiles as _UploadedFiles } from '@nestjs/common';
import { FileFieldsValidator, IValidatorOptions } from '../validators/file-fields.validator';

export const UploadedFileFields = (options: IValidatorOptions = {}) =>
{
    return _UploadedFiles(
        new ParseFilePipe({
            validators: [
                new FileFieldsValidator(options)
            ]
        })
    );
};
