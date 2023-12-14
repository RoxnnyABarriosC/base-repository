import { GoogleAuthGuard } from '@modules/auth/presentation/guards';
import { UseGuards, applyDecorators } from '@nestjs/common';

export const GoogleAuth = () =>
{
    return applyDecorators(
        UseGuards(GoogleAuthGuard)
    );
};
