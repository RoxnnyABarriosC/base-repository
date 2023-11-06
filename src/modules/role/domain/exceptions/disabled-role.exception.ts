import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/exceptions';

export class DisabledRoleException extends HttpException
{
    constructor()
    {
        super(HttpStatus.FORBIDDEN, 'exceptions.role.disabledRole');
    }
}
