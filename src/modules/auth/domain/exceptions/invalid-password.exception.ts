import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/app/exceptions';

export class InvalidPasswordException extends HttpException
{
    constructor()
    {
        super(HttpStatus.NOT_FOUND, 'exceptions.auth.invalidPassword');
    }
}
