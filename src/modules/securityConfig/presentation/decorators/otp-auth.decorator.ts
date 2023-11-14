import { OTPAuthGuard } from '@modules/securityConfig/presentation/guards';
import { UseGuards, applyDecorators } from '@nestjs/common';

export const OTPAuth = () =>
{
    return applyDecorators(
        UseGuards(OTPAuthGuard)
    );
};
