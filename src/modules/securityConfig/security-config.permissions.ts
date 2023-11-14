import { Permissions } from '@shared/factories';

export enum SecurityConfigPermissionsEnum {
    MANAGE = 'securityConfig:manage',
}

export class SecurityConfigPermissions extends Permissions<SecurityConfigPermissionsEnum>(SecurityConfigPermissionsEnum, SecurityConfigPermissionsEnum.MANAGE, 'SECURITY_CONFIG')
{ }
