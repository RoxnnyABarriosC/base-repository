import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/exceptions';

export class NotFoundOrDisabledRoleException extends HttpException
{
    constructor()
    {
        super(HttpStatus.FORBIDDEN, 'exceptions.role.notFoundOrDisabledRol');
    }
}

