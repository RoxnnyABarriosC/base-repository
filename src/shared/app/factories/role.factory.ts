import { ALL_MANAGE_PERMISSION } from '../constants';

export interface IRoleFactoryMethods
{
    Get(): string[];
    Name: string;
    AllManage(): IRoleFactoryMethods;
    Extends(...permissions: any[][]): IRoleFactoryMethods;
    Exclude(...permissions: any[]): IRoleFactoryMethods;
}

export interface IRoleFactory {
    I: IRoleFactoryMethods;
    new(): IRoleFactoryMethods;
}

export const Role = (name: string) =>
{
    class RoleFactory
    {
        protected static instance: RoleFactory;
        private permissions: string[] = [];

        static get I(): RoleFactory
        {
            if (!this.instance)
            {
                this.instance = new this();
            }

            return this.instance;
        }

        public get Name(): string
        {
            return name;
        }

        public Get(): string[]
        {
            return this.permissions;
        }

        public AllManage(): RoleFactory
        {
            this.permissions = [ALL_MANAGE_PERMISSION];
            return this;
        }

        public Extends(...permissions: string[][]): RoleFactory
        {
            this.permissions = permissions.reduce((prev, current) => [...new Set([...prev, ...current])], this.permissions);
            return this;
        }

        public Exclude(...permissions: string[][]): RoleFactory
        {
            const _permissions = permissions.reduce((prev, current) => [...new Set([...prev, ...current])], []);
            this.permissions = this.permissions.filter(permission => !_permissions.includes(permission));
            return this;
        }
    }

    return RoleFactory as unknown as IRoleFactory;
};
