import {
    ParseFilePipe,
    UploadedFiles as _UploadedFiles
} from '@nestjs/common';
import { FileValidator, IValidatorOptions } from '../validators/file.validator';

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
