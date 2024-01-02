import { UseGuards, applyDecorators } from '@nestjs/common';
import { LocalAdminAuthGuard } from '../guards';

export const LocalAdminAuth = () =>
{
    return applyDecorators(
        UseGuards(LocalAdminAuthGuard)
    );
};
