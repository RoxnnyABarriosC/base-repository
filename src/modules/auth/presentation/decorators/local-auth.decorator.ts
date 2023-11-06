import { UseGuards, applyDecorators } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';

export const LocalAuth = () =>
{
    return applyDecorators(
        UseGuards(LocalAuthGuard)
    );
};
