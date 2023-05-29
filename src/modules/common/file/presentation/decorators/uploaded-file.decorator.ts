import { MimeTypeEnum } from '@modules/common/file/domain/enums';
import {
    FileTypeValidator,
    MaxFileSizeValidator,
    ParseFilePipe,
    UploadedFile as _UploadedFile
} from '@nestjs/common';
import { createSearchRegex, megabytesToBytes } from '@shared/utils';

interface Props {
    required?: boolean;
    maxSize?: number; // In MegaByte
    fileType: MimeTypeEnum | MimeTypeEnum[];
    paramName?: string;
}

export const  UploadedFile = ({ required =  true, fileType, maxSize = 10, paramName = 'file' }: Props) =>
{
    return _UploadedFile(paramName,
        new ParseFilePipe({
            fileIsRequired: required,
            validators: [
                new MaxFileSizeValidator({ maxSize: megabytesToBytes(maxSize) }),
                new FileTypeValidator({ fileType:  Array.isArray(fileType) ? createSearchRegex(fileType) : fileType })
            ]
        })
    );
};
