import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/app/exceptions';

export class BlockedAccountException extends HttpException
{
    constructor()
    {
        super(HttpStatus.UNAUTHORIZED, 'exceptions.auth.blockedAccount');
    }
}
