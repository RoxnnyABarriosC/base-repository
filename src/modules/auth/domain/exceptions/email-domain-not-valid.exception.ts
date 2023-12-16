import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/app/exceptions';

export class EmailDomainNotValidException extends HttpException
{
    constructor(allowed: string[])
    {
        super(HttpStatus.UNPROCESSABLE_ENTITY, 'exceptions.auth.emailDomainNotValid', { allowed });
    }
}
