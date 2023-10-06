import { MimeTypeEnum } from '@modules/common/file/domain/enums';
import { FileValidator, ValidatorOptions } from '@modules/common/file/presentation/validators/file.validator';
import {
    ParseFilePipe,
    UploadedFiles as _UploadedFiles
} from '@nestjs/common';

interface Props extends ValidatorOptions {
    required?: boolean;
}

export const UploadedFiles = ({ required = true, ...options }: Props) =>
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
