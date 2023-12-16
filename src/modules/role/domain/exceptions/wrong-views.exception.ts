import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/app/exceptions';

export class WrongViewsException extends HttpException
{
    constructor()
    {
        super(HttpStatus.NOT_FOUND, 'exceptions.role.wrongViews');
    }
}

