import { ALL_MANAGE_PERMISSION } from '@shared/app/constants';
import { Permissions } from '@shared/app/factories';

export enum OtherPermissionsEnum {
}

export class OtherPermissions extends Permissions<OtherPermissionsEnum>(OtherPermissionsEnum, ALL_MANAGE_PERMISSION, 'OTHER')
{ }
