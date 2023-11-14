import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/exceptions/http.exception';

export class CannotUseYourOldPasswordException extends HttpException
{
    constructor()
    {
        super(HttpStatus.UNPROCESSABLE_ENTITY, 'exceptions.securityConfig.oldPassword.cannotUse');
    }
}
