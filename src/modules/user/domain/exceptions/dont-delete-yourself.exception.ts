import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/exceptions';

export class DontDeleteYourselfException extends HttpException
{
    constructor()
    {
        super(HttpStatus.FORBIDDEN, 'exceptions.user.dontDeleteYourself');
    }
}
