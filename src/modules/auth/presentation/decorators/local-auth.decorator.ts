import { UseGuards, applyDecorators } from '@nestjs/common';
import { LocalAuthGuard } from '../guards';

export const LocalAuth = () =>
{
    return applyDecorators(
        UseGuards(LocalAuthGuard)
    );
};
