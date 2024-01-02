import { RequiredPermissionsException } from '@modules/auth/domain/exceptions';
import { AuthService } from '@modules/auth/domain/services';
import { RequestAuth } from '@modules/auth/domain/strategies';
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { Protected } from '@shared/app/abstractClass';
import {
    CHECK_POLICIES_KEY,
    FORCE_CHECK_POLICY_KEY,
    MANAGE_PERMISSIONS_KEY,
    PERMISSIONS_KEY,
    PERMISSION_ACTION_METHOD_KEY,
    PermissionActions,
    checkIsPublic
} from '@shared/app/decorators';


@Injectable()
export class ProtectedGuard extends Protected<RequestAuth> implements CanActivate
{
    private readonly logger = new Logger(ProtectedGuard.name);
    private readonly authService: AuthService;

    constructor(
        protected override readonly reflector: Reflector,
        protected override readonly moduleRef: ModuleRef
    )
    {
        super();
        // TODO: Validar por que no puedo inyectar AuthService directamente en el constructor
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

        const forceCheckPolicy = this.reflector.getAllAndOverride(FORCE_CHECK_POLICY_KEY, [
            context.getHandler(),
            context.getClass()
        ]) ?? false;

        if (permissions.length)
        {
            allow = await this.authService.authorize(data, permissions, permissionActions);
        }

        const { isSuperAdmin, manage } = this.authService.getAuthorizationData(data,  managePermissions);

        if (!isSuperAdmin && !manage && !allow)
        {
            throw new RequiredPermissionsException(permissionActions === 'every', ...permissions);
        }

        if (!isSuperAdmin && !manage && policies.length || ((isSuperAdmin || manage) && forceCheckPolicy && policies.length))
        {
            await this.execPolicyHandler(policies, request);
        }

        return (isSuperAdmin || manage || allow);
    }
}
