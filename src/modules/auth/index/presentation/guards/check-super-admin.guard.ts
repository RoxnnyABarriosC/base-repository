import { SuperAdminOnlyException } from '@modules/auth/index/domain/exceptions';
import { AuthDataInterface } from '@modules/auth/index/domain/strategies';
import { checkIsPublic } from '@modules/auth/index/presentation/decorators';
import { CanActivate, ExecutionContext, Inject, Injectable, Logger, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ForbiddenCustomException } from '@shared/exceptions';

export const CHECK_SUPER_ADMIN = 'check_super_admin';
export const CheckSuperAdmin = () => SetMetadata(CHECK_SUPER_ADMIN, true);

@Injectable()
export class CheckSuperAdminGuard implements CanActivate
{
    private readonly logger = new Logger(CheckSuperAdminGuard.name);

    constructor(
        private readonly reflector: Reflector
    )
    { }

    async canActivate(context: ExecutionContext): Promise<boolean>
    {
        if (checkIsPublic(context, this.reflector))
        {
            return true;
        }

        const checkSuperAdmin = this.reflector.getAllAndOverride<boolean>(CHECK_SUPER_ADMIN, [
            context.getHandler(),
            context.getClass()
        ]) ?? false;

        const { user: { data } } = context.switchToHttp().getRequest<Request & { user: AuthDataInterface }>();

        if (checkSuperAdmin && !data.isSuperAdmin)
        {
            throw new SuperAdminOnlyException();
        }

        return true;
    }
}
