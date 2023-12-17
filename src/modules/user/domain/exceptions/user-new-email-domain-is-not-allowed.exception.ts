import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/app/exceptions';

export class UserNewEmailDomainIsNotAllowedException extends HttpException
{
    constructor(options: object)
    {
        super(HttpStatus.UNPROCESSABLE_ENTITY, 'exceptions.user.newEmailDomainIsNotAllowed', { ...options });
    }
}

