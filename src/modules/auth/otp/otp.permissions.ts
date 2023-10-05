import { Permissions } from '@shared/factories';

export enum OTPPermissionsEnum {
    MANAGE = 'otp:manage',
}

export class OTPPermissions extends Permissions<OTPPermissionsEnum>(OTPPermissionsEnum, OTPPermissionsEnum.MANAGE, 'OTP')
{ }
