import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/exceptions/http.exception';

export class OTPUniqueTargetException extends HttpException
{
    constructor(target: string, value: string)
    {
        super(HttpStatus.UNPROCESSABLE_ENTITY, 'exceptions.otp.uniqueTargetInUse', {
            target,
            value
        });
    }
}
