import { FileFieldsValidator, ValidatorOptions } from '@modules/common/file/presentation/validators';
import { ParseFilePipe, UploadedFiles as _UploadedFiles } from '@nestjs/common';


export const UploadedFileFields = (options: ValidatorOptions = {}) =>
{
    return _UploadedFiles(
        new ParseFilePipe({
            validators: [
                new FileFieldsValidator(options)
            ]
        })
    );
};
