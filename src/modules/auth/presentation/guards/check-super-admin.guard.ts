import { SuperAdminOnlyException } from '@modules/auth/domain/exceptions';
import { RequestAuth, SocketAuth } from '@modules/auth/domain/strategies';
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CHECK_SUPER_ADMIN, checkIsPublic } from '@shared/app/decorators';

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

        let request: RequestAuth | SocketAuth = context.switchToHttp().getRequest<RequestAuth>();

        if (context['contextType'] === 'ws')
        {
            request = context.switchToWs().getClient<SocketAuth>();
        }

        const { user: { data } } = request;

        if (checkSuperAdmin && !data.isSuperAdmin)
        {
            throw new SuperAdminOnlyException();
        }

        return true;
    }
}
