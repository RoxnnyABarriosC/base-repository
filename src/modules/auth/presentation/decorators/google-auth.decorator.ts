import { UseGuards, applyDecorators } from '@nestjs/common';
import { GoogleAuthGuard } from '../guards';

export const GoogleAuth = () =>
{
    return applyDecorators(
        UseGuards(GoogleAuthGuard)
    );
};
