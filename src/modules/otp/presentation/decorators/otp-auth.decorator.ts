import { OtpAuthCheckGuard } from '@modules/otp/presentation/guards';
import { UseGuards, applyDecorators } from '@nestjs/common';

export const OtpAuth = () =>
{
    return applyDecorators(
        UseGuards(OtpAuthCheckGuard)
    );
};
