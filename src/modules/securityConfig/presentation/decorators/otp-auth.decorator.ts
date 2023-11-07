import { OtpAuthCheckGuard } from '@modules/securityConfig/presentation/guards';
import { UseGuards, applyDecorators } from '@nestjs/common';

export const OtpAuth = () =>
{
    return applyDecorators(
        UseGuards(OtpAuthCheckGuard)
    );
};
