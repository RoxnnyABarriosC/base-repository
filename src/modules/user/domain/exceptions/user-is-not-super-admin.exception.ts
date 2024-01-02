import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/app/exceptions';

export class UserIsNotSuperAdminException extends HttpException
{
    constructor()
    {
        super(HttpStatus.FORBIDDEN, 'exceptions.user.isNotSuperAdmin');
    }
}

