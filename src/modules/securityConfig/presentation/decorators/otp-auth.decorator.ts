import { OTPAuthCheckGuard } from '@modules/securityConfig/presentation/guards';
import { UseGuards, applyDecorators } from '@nestjs/common';

export const OTPAuth = () =>
{
    return applyDecorators(
        UseGuards(OTPAuthCheckGuard)
    );
};
