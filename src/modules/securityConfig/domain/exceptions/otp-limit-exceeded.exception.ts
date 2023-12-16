import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/app/exceptions';

export class OTPLimitExceededException extends HttpException
{
    constructor(type: string, remainingAttempts: number)
    {
        super(HttpStatus.UNPROCESSABLE_ENTITY, 'exceptions.securityConfig.otp.limitExceeded', { type, remainingAttempts });
    }
}
