import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/exceptions';

export class UserIsNotSuperAdminException extends HttpException
{
    constructor()
    {
        super(HttpStatus.FORBIDDEN, 'exceptions.user.isNotSuperAdmin');
    }
}

