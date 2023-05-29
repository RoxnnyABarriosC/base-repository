import { UseGuards, applyDecorators } from '@nestjs/common';
import { CheckSuperAdminGuard } from '../guards/check-super-admin.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ProtectedGuard } from '../guards/protected.guard';

export const Protected = () =>
{
    return applyDecorators(
        UseGuards(JwtAuthGuard, CheckSuperAdminGuard, ProtectedGuard)
    );
};
