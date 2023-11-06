import { FileValidator, IValidatorOptions } from '@modules/common/file/presentation/validators/file.validator';
import {
    ParseFilePipe,
    UploadedFiles as _UploadedFiles
} from '@nestjs/common';

interface IPropsUploadedFiles extends IValidatorOptions {
    required?: boolean;
}

export const UploadedFiles = ({ required = true, ...options }: IPropsUploadedFiles) =>
{
    return _UploadedFiles(
        new ParseFilePipe({
            fileIsRequired: required,
            validators: [
                new FileValidator(options)
            ]
        })
    );
};
