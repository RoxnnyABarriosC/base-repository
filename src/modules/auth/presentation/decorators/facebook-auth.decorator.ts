import { FacebookAuthGuard } from '@modules/auth/presentation/guards';
import { UseGuards, applyDecorators } from '@nestjs/common';

export const FacebookAuth = () =>
{
    return applyDecorators(
        UseGuards(FacebookAuthGuard)
    );
};
