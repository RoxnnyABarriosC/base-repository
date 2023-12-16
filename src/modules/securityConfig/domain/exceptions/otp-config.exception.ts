import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/app/exceptions';

export class OTPConfigException extends HttpException
{
    constructor(requiredProperties: string[], values: object)
    {
        super(HttpStatus.UNPROCESSABLE_ENTITY, 'exceptions.securityConfig.otp.required', { requiredProperties, ...values });
    }
}
