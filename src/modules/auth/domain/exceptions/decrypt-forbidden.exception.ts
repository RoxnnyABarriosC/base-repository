import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/exceptions';

export class DecryptForbiddenException extends HttpException
{
    constructor()
    {
        super(HttpStatus.FORBIDDEN, 'exceptions.auth.decryptForbidden');
    }
}

