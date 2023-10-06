import { FileValidator, ValidatorOptions } from '@modules/common/file/presentation/validators/file.validator';
import {
    ParseFilePipe,
    UploadedFile as _UploadedFile
} from '@nestjs/common';

interface Props extends ValidatorOptions {
    required?: boolean;
}
export const  UploadedFile = ({ required = true, ...options }: Props) =>
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
