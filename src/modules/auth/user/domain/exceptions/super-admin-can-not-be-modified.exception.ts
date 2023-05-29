import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/exceptions';

export class SuperAdminCanNotBeModifiedException extends HttpException
{
    constructor()
    {
        super(HttpStatus.FORBIDDEN, 'exceptions.user.superAdminCanNotBeModifiedException');
    }
}
