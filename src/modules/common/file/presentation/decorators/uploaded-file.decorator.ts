import {
    ParseFilePipe,
    UploadedFile as _UploadedFile
} from '@nestjs/common';
import { FileValidator, IValidatorOptions } from '../validators/file.validator';

interface IUploadedFileProps extends IValidatorOptions {
    required?: boolean;
}
export const  UploadedFile = ({ required = true, ...options }: IUploadedFileProps) =>
{
    return _UploadedFile(
        new ParseFilePipe({
            fileIsRequired: required,
            validators: [
                new FileValidator(options)
            ]
        })
    );
};
