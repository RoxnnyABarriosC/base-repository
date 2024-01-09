import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthorizeGuard, CheckEmailDomainGuard, CheckSuperAdminGuard, JWTAuthGuard, JWTWebsocketAuthGuard } from '../guards';

export const Protected = (context: 'http' | 'ws' = 'http') =>
{
    const decorators: any  = [JWTAuthGuard, CheckSuperAdminGuard, CheckEmailDomainGuard, AuthorizeGuard];

    if (context === 'ws')
    {
        decorators[0] = JWTWebsocketAuthGuard;
    }

    return applyDecorators(
        UseGuards(...decorators)
    );
};
