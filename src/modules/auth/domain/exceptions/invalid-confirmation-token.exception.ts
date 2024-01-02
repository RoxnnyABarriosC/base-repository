import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/app/exceptions';

export class InvalidConfirmationTokenException extends HttpException
{
    constructor()
    {
        super(HttpStatus.FORBIDDEN, 'exceptions.auth.invalidConfirmationToken');
    }
}
