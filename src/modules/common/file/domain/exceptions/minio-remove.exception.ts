import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/exceptions';


export class MinioRemoveException extends HttpException
{
    constructor()
    {
        super(HttpStatus.UNPROCESSABLE_ENTITY, 'exceptions.file.minioRemove');
    }
}
