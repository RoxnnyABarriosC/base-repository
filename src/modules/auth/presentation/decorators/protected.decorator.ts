import { UseGuards, applyDecorators } from '@nestjs/common';
import { CheckEmailDomainGuard, CheckSuperAdminGuard, JwtAuthGuard, ProtectedGuard } from '../guards';


export const Protected = () =>
{
    return applyDecorators(
        UseGuards(JwtAuthGuard, CheckSuperAdminGuard, CheckEmailDomainGuard, ProtectedGuard)
    );
};
