import { IRoleFactoryMethods } from '@shared/app/factories/role.factory';

export interface IAppRolesFactory {
    getRoles(): IRoleFactoryMethods[];
}


export const  AppRoles = (fn: () => IRoleFactoryMethods[]) =>
{
    class AppRolesFactory
    {
        static getRoles()
        {
            return fn();
        }
    }

    return AppRolesFactory as unknown as IAppRolesFactory;
};
