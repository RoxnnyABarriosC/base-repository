import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/exceptions/http.exception';

export class OtpConfigException extends HttpException
{
    constructor(requiredOtpProperties: string[], values: object)
    {
        super(HttpStatus.UNPROCESSABLE_ENTITY, 'exceptions.otp.requiredOtp', { requiredOtpProperties, ...values });
    }
}
