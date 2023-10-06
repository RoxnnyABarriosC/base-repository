import { MimeTypeEnum } from '@modules/common/file/domain/enums';
import { FileValidator, ValidatorOptions } from '@modules/common/file/presentation/validators/file.validator';
import {
    FileTypeValidator,
    MaxFileSizeValidator,
    ParseFilePipe,
    UploadedFile as _UploadedFile
} from '@nestjs/common';
import { createSearchRegex, megabytesToBytes } from '@shared/utils';

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
