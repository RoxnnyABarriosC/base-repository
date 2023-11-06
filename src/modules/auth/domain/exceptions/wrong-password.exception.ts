import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/exceptions/http.exception';

export class WrongPasswordException extends HttpException
{
    constructor()
    {
        super(HttpStatus.UNAUTHORIZED, 'exceptions.auth.wrongPassword');
    }
}
