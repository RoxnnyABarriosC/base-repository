import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/app/exceptions';

export class TokenBlackListedException extends HttpException
{
    constructor()
    {
        super(HttpStatus.UNAUTHORIZED, 'exceptions.auth.tokenBlackListed');
    }
}
