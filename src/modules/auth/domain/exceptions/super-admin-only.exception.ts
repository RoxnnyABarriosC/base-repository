import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/app/exceptions';

export class SuperAdminOnlyException extends HttpException
{
    constructor()
    {
        super(HttpStatus.FORBIDDEN, 'exceptions.auth.superAdminOnly');
    }
}
