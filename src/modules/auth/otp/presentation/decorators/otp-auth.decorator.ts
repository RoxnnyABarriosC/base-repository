import { OtpAuthCheckGuard } from '@modules/auth/otp/presentation/guards';
import { UseGuards, applyDecorators } from '@nestjs/common';

export const OtpAuth = () =>
{
    return applyDecorators(
        UseGuards(OtpAuthCheckGuard)
    );
};
