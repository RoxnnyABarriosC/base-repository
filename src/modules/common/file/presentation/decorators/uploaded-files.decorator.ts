import { MimeTypeEnum } from '@modules/common/file/domain/enums';
import {
    FileTypeValidator,
    MaxFileSizeValidator,
    ParseFilePipe,
    UploadedFiles as _UploadedFiles
} from '@nestjs/common';
import { createSearchRegex, megabytesToBytes } from '@shared/utils';

interface Props {
    required?: boolean;
    maxSize?: number; // In MegaByte
    fileType: MimeTypeEnum | MimeTypeEnum[]
}

export const UploadedFiles = ({ required =  true, fileType, maxSize = 10 }: Props) =>
{
    return _UploadedFiles(
        new ParseFilePipe({
            fileIsRequired: required,
            validators: [
                new MaxFileSizeValidator({ maxSize: megabytesToBytes(maxSize) }),
                new FileTypeValidator({ fileType:  Array.isArray(fileType) ? createSearchRegex(fileType) : fileType })
            ]
        })
    );
};
