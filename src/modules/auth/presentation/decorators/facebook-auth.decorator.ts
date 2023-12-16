import { UseGuards, applyDecorators } from '@nestjs/common';
import { FacebookAuthGuard } from '../guards';

export const FacebookAuth = () =>
{
    return applyDecorators(
        UseGuards(FacebookAuthGuard)
    );
};
