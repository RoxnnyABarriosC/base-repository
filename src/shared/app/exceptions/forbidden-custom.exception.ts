import { HttpStatus } from '@nestjs/common';
import { HttpException } from './http.exception';

export class ForbiddenCustomException extends HttpException
{
    constructor()
    {
        super(HttpStatus.FORBIDDEN, 'exceptions.shared.forbidden');
    }
}
