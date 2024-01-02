import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/app/exceptions';

export class WrongPermissionsException extends HttpException
{
    constructor()
    {
        super(HttpStatus.NOT_FOUND, 'exceptions.role.wrongPermissions');
    }
}

