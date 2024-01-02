import { UseGuards, applyDecorators } from '@nestjs/common';
import { RefreshTokenGuard } from '../guards';

export const CheckRefreshToken = () =>
{
    return applyDecorators(
        UseGuards(RefreshTokenGuard)
    );
};
