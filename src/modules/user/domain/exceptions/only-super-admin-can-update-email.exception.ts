import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/app/exceptions';

export class OnlySuperAdminCanUpdateEmailException extends HttpException
{
    constructor()
    {
        super(HttpStatus.FORBIDDEN, 'exceptions.user.onlySuperAdminCanUpdateEmail');
    }
}

