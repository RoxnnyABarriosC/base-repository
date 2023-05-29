import { ALL_MANAGE_PERMISSION, Permissions } from '@shared/factories';

export enum OtherPermissionsEnum {

}

export class OtherPermissions extends Permissions<OtherPermissionsEnum>(OtherPermissionsEnum, ALL_MANAGE_PERMISSION, 'OTHER')
{ }
