import { AppleAuthGuard } from '@modules/auth/presentation/guards/apple-auth.guard';
import { UseGuards, applyDecorators } from '@nestjs/common';

export const AppleAuth = () =>
{
    return applyDecorators(
        UseGuards(AppleAuthGuard)
    );
};
