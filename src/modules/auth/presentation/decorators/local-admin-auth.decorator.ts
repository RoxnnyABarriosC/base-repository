import { UseGuards, applyDecorators } from '@nestjs/common';
import { LocalAdminAuthGuard } from '../guards/local-admin-auth.guard';

export const LocalAdminAuth = () =>
{
    return applyDecorators(
        UseGuards(LocalAdminAuthGuard)
    );
};
