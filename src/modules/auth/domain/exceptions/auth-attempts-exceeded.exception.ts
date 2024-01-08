import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/app/exceptions';

export class AuthAttemptsExceededException extends HttpException
{
    constructor(time: number, to: Date)
    {
        super(HttpStatus.FORBIDDEN, 'exceptions.auth.authAttemptsExceeded', { time: `${time}s`, to });
    }
}
