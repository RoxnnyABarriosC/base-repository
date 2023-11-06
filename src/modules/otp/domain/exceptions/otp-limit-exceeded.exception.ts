import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/exceptions/http.exception';

export class OtpLimitExceededException extends HttpException
{
    constructor(type: string, remainingAttempts: number)
    {
        super(HttpStatus.UNPROCESSABLE_ENTITY, 'exceptions.otp.limitExceeded', { type, remainingAttempts });
    }
}
