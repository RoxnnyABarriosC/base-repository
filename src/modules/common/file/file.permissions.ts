import { Permissions } from '@shared/app/factories';

export enum FilePermissionsEnum {
    MANAGE = 'file:manage',
    SAVE = 'file:save',
    SAVE_MANY = 'file:save:many',
    UPDATE = 'file:update',
    SHOW = 'file:show',
    LIST = 'file:list',
    DELETE = 'file:delete',
    RESTORE = 'file:restore',
}

export class FilePermissions extends Permissions<FilePermissionsEnum>(FilePermissionsEnum, FilePermissionsEnum.MANAGE, 'FILES')
{ }
