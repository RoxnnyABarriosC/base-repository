import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/app/exceptions';

export class UnverifiedUserException extends HttpException
{
    constructor()
    {
        super(HttpStatus.FORBIDDEN, 'exceptions.user.unverifiedUser');
    }
}

