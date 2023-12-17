import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/app/exceptions';

export class EmailDomainNotValidException extends HttpException
{
    constructor(options: object)
    {
        super(HttpStatus.FORBIDDEN, 'exceptions.auth.emailDomainNotValid', { ...options });
    }
}
