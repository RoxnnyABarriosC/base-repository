import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/app/exceptions';

export class MinioUploadException extends HttpException
{
    constructor()
    {
        super(HttpStatus.FORBIDDEN, 'exceptions.file.minioUpload');
    }
}
