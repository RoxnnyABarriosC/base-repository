import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/exceptions/http.exception';

export class OTPLimitExceededException extends HttpException
{
    constructor(type: string, remainingAttempts: number)
    {
        super(HttpStatus.UNPROCESSABLE_ENTITY, 'exceptions.securityConfig.otp.limitExceeded', { type, remainingAttempts });
    }
}
