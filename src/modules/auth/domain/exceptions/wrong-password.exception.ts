import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/app/exceptions';

export class WrongPasswordException extends HttpException
{
    constructor()
    {
        super(HttpStatus.UNAUTHORIZED, 'exceptions.auth.wrongPassword');
    }
}
