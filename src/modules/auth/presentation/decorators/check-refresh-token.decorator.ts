import { UseGuards, applyDecorators } from '@nestjs/common';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';

export const CheckRefreshToken = () =>
{
    return applyDecorators(
        UseGuards(RefreshTokenGuard)
    );
};
