import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/exceptions/http.exception';

export class OTPConfigException extends HttpException
{
    constructor(requiredOtpProperties: string[], values: object)
    {
        super(HttpStatus.UNPROCESSABLE_ENTITY, 'exceptions.securityConfig.otp.required', { requiredOtpProperties, ...values });
    }
}
