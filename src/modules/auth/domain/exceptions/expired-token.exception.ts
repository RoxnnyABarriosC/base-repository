import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/app/exceptions';

export class ExpiredTokenException extends HttpException
{
    constructor()
    {
        super(HttpStatus.FORBIDDEN, 'exceptions.auth.expiredToken');
    }
}
