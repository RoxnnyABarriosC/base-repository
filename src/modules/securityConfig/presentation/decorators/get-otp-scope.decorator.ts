import { GetOTPScopeGuard } from '@modules/securityConfig/presentation/guards';
import { UseGuards, applyDecorators } from '@nestjs/common';

export const GetOTPScope = () =>
{
    return applyDecorators(
        UseGuards(GetOTPScopeGuard)
    );
};
