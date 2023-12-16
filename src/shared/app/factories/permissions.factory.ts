
export type GroupPermissions<E> = {
    group: string;
    permissions: E[]
}

export interface IPermissionsFactoryMethods<E> {
    Get(original?: boolean): string[];
    Reset(): IPermissionsFactoryMethods<E>;
    Group(): GroupPermissions<E>;
    Manage(): IPermissionsFactoryMethods<E>;
    Exclude(...permissions: E[]): IPermissionsFactoryMethods<E>;
}

export interface IPermissionsFactory<E> {
    I: IPermissionsFactoryMethods<E>;
    new(): IPermissionsFactoryMethods<E>;
}

export const Permissions = <E>(permissionsEnum: object, managePermission: string, group: string): IPermissionsFactory<E> =>
{
    const _originalPermissions: E[] = Object.values(permissionsEnum as any);
    const _permissions: E[] =  _originalPermissions.filter(p => p !== managePermission);

    class PermissionsFactory
    {
        protected static instance: PermissionsFactory;
        private originalPermissions: E[] = [..._originalPermissions];
        private permissions: E[] = [..._permissions];

        static get I(): PermissionsFactory
        {
            if (!this.instance)
            {
                this.instance = new this();
            }

            return this.instance;
        }

        public Manage(): PermissionsFactory
        {
            this.permissions = [managePermission] as any;

            return this;
        }

        public Get(original = false): E[]
        {
            if (original)
            {
                return this.originalPermissions;
            }

            return this.permissions;
        }

        public Reset(): PermissionsFactory
        {
            this.permissions = this.originalPermissions;
            return this;
        }

        public Group()
        {
            return {
                group,
                permissions: this.originalPermissions
            };
        }

        public Exclude(...permissions: E[]): PermissionsFactory
        {
            this.permissions = this.permissions.filter((permission) => !permissions.includes(permission));

            return this;
        }
    }

    return PermissionsFactory as unknown as IPermissionsFactory<E>;
};
