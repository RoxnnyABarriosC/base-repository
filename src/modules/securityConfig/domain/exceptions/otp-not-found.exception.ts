import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/app/exceptions';

export class OTPNotFoundException extends HttpException
{
    constructor(otpType: string)
    {
        super(HttpStatus.UNPROCESSABLE_ENTITY, `exceptions.otp.${otpType}.notFound`, {
            otpType
        });
    }
}
