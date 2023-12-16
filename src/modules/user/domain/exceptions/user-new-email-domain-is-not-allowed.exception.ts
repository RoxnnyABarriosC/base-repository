import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/app/exceptions';

export class UserNewEmailDomainIsNotAllowedException extends HttpException
{
    constructor(allowed: string[])
    {
        super(HttpStatus.FORBIDDEN, 'exceptions.user.newEmailDomainIsNotAllowed', { allowed });
    }
}

