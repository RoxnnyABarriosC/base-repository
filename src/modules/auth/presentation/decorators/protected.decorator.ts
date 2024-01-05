import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthorizeGuard, CheckEmailDomainGuard, CheckSuperAdminGuard, JwtAuthGuard } from '../guards';

export const Protected = () =>
{
    return applyDecorators(
        UseGuards(JwtAuthGuard, CheckSuperAdminGuard, CheckEmailDomainGuard, AuthorizeGuard)
    );
};
