import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/app/exceptions';
export class NotAllowedRemoveASystemRolException extends HttpException
{
    constructor()
    {
        super(HttpStatus.FORBIDDEN, 'exceptions.role.notAllowedRemoveASystemRol');
    }
}

