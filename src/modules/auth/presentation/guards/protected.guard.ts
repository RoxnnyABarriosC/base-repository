import { RequiredPermissionsException } from '@modules/auth/domain/exceptions';
import { AuthService } from '@modules/auth/domain/services';
import { RequestAuth } from '@modules/auth/domain/strategies';
import { CHECK_POLICIES_KEY, MANAGE_PERMISSIONS_KEY, PERMISSIONS_KEY, PERMISSION_ACTION_METHOD_KEY, PermissionActions } from '@modules/auth/presentation/decorators';
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { checkIsPublic } from '../decorators/public.decorator';

export abstract class Policy
{
    abstract handle(request: RequestAuth, module: any): Promise<void>
}

export type PolicyType = { new(): Policy }

@Injectable()
export class ProtectedGuard implements CanActivate
{
    private readonly logger = new Logger(ProtectedGuard.name);
    private readonly authService: AuthService;

    constructor(
        private readonly reflector: Reflector,
        private readonly moduleRef: ModuleRef
    )
    {
        this.authService = this.moduleRef.get(AuthService, { strict: false });
    }

    async canActivate(context: ExecutionContext): Promise<boolean>
    {
        if (checkIsPublic(context, this.reflector))
        {
            return true;
        }

        const request = context.switchToHttp().getRequest<RequestAuth>();

        const { user: { data } } = request;

        let allow = true;

        const permissionActions = this.reflector.getAllAndOverride<PermissionActions>(PERMISSION_ACTION_METHOD_KEY, [
            context.getHandler(),
            context.getClass()
        ]) ?? 'some';

        const permissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass()
        ]) ?? [];

        const managePermissions = this.reflector.getAllAndOverride<string[]>(MANAGE_PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass()
        ]) ?? [];

        const policies = this.reflector.getAllAndOverride(CHECK_POLICIES_KEY, [
            context.getHandler(),
            context.getClass()
        ]) ?? [];

        if (permissions.length)
        {
            allow = await this.authService.authorize(data, permissions, permissionActions);
        }

        const { isSuperAdmin, manage } = this.authService.getAuthorizationData(data,  managePermissions);

        if (!isSuperAdmin && !manage && !allow)
        {
            throw new RequiredPermissionsException(permissionActions === 'every', ...permissions);
        }

        if (!isSuperAdmin && !manage && policies.length)
        {
            await this.execPolicyHandler(policies, request);
        }

        return (isSuperAdmin || manage || allow);
    }

    private async execPolicyHandler(policies: PolicyType[], request: RequestAuth): Promise<void>
    {
        for (const policy of policies)
        {
            await (new policy()).handle(request, this.moduleRef);
        }
    }
}
