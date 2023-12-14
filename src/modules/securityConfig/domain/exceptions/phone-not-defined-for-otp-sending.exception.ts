import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/exceptions/http.exception';

export class PhoneNotDefinedForOtpSendingException extends HttpException
{
    constructor()
    {
        super(HttpStatus.UNPROCESSABLE_ENTITY, 'exceptions.securityConfig.phone.notDefined');
    }
}
