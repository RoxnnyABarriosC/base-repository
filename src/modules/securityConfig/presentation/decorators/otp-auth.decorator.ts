import { UseGuards, applyDecorators } from '@nestjs/common';
import { OTPAuthGuard } from '../guards';

export const OTPAuth = () =>
{
    return applyDecorators(
        UseGuards(OTPAuthGuard)
    );
};
