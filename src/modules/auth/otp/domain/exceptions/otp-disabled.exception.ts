import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/exceptions/http.exception';

export class OtpDisabledException extends HttpException
{
    constructor(type: string)
    {
        super(HttpStatus.UNPROCESSABLE_ENTITY, `exceptions.otp.${type}.disabled`, { type });
    }
}
