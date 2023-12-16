import { UseGuards, applyDecorators } from '@nestjs/common';
import { AppleAuthGuard } from '../guards';

export const AppleAuth = () =>
{
    return applyDecorators(
        UseGuards(AppleAuthGuard)
    );
};
