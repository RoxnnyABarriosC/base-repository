import { FileValidator, IValidatorOptions } from '@modules/common/file/presentation/validators/file.validator';
import {
    ParseFilePipe,
    UploadedFile as _UploadedFile
} from '@nestjs/common';

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
