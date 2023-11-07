import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/exceptions/http.exception';

export class OTPDisabledException extends HttpException
{
    constructor(type: string)
    {
        super(HttpStatus.UNPROCESSABLE_ENTITY, `exceptions.securityConfig.otp.${type}.disabled`, { type });
    }
}
