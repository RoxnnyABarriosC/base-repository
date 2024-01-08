import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/app/exceptions';

export class TemporalBlockedAccountException extends HttpException
{
    constructor(time: number, to: Date)
    {
        super(HttpStatus.UNAUTHORIZED, 'exceptions.auth.temporalBlockedAccount', { time: `${time}s`, to });
    }
}
