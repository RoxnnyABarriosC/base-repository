import { ALL_MANAGE_PERMISSION } from '@shared/app/constants';
import { GroupPermissions, IPermissionsFactoryMethods } from './permissions.factory';

export interface IAppPermissionsFactoryMethods {
    permissionsInstance: IPermissionsFactoryMethods<any>[];
    groupPermissions(): GroupPermissions<any>[];
    permissions(): string[];
}

export interface IAppPermissionsFactory {
    permissionsInstance: IPermissionsFactoryMethods<any>[];
    groupPermissions(): GroupPermissions<any>[];
    permissions(): string[];
}


export const  AppPermissions = (...instancePermissions: IPermissionsFactoryMethods<any>[]) =>
{
    class AppPermissionsFactory
    {
        private static readonly permissionsInstance = [
            {
                Group(): GroupPermissions<any>
                {
                    return {
                        group: 'APP',
                        permissions: [ALL_MANAGE_PERMISSION]
                    };
                },
                Get(original?: boolean): string[]
                {
                    return [ALL_MANAGE_PERMISSION];
                }
            },
            ...instancePermissions
        ];

        static groupPermissions(): GroupPermissions<any>[]
        {
            return  this.permissionsInstance.reduce((prev, curr) => [...prev, curr.Group()], []);
        }

        static permissions(): string[]
        {
            return this.permissionsInstance.reduce((prev, curr) => [... new Set([...prev, ...curr.Get(true)])], []);
        }
    }

    return  AppPermissionsFactory as unknown as IAppPermissionsFactory;
};
