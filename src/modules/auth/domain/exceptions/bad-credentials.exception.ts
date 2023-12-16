import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/app/exceptions';

export class BadCredentialsException extends HttpException
{
    constructor()
    {
        super(HttpStatus.UNPROCESSABLE_ENTITY, 'exceptions.auth.badCredentials');
    }
}
