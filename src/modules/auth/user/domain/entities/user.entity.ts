import { PasswordValueObject } from '@modules/auth/index/domain/valueObjects';
import { Role } from '@modules/auth/role/domain/entities';
import { GenderEnum } from '@modules/auth/user/domain/enums';
import { File } from '@modules/common/file/domain/entities';
import { BaseEntity } from '@shared/entities/base.entity';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class User extends BaseEntity
{
    @Expose() public userName: string;
    @Expose() public firstName: string;
    @Expose() public lastName: string;
    @Expose() public email: string;
    @Expose() public phone: string;
    @Expose() public gender: GenderEnum;
    @Expose() public birthday: Date;
    @Expose() public enable = false;
    @Expose() public verify = false;
    @Expose() public firstLogin = true;
    @Expose() public isSuperAdmin = false;
    public password: PasswordValueObject | string;
    @Expose() public permissions: string[];
    @Expose() public passwordRequestedAt: Date | number;
    @Expose() public roles: Role[];
    @Expose() public mainPicture?: File;
    @Expose() public banner?: File;

    constructor(data?: Partial<User>, validate?: boolean)
    {
        super();
        this.build(data, validate);
    }

    public get FullName()
    {
        return `${this.firstName} ${this.lastName}`;
    }

    public cleanRoles(): void
    {
        this.roles = [];
    }

    public set Role(roles: Role | Role[])
    {
        roles = Array.isArray(roles) ? roles : [roles];

        if (Array.isArray(this.roles))
        {
            this.roles = [...new Set([...roles as Role[], ...this.roles])];
        }
        else
        {
            this.roles = roles;
        }
    }

    public get RolesIds(): string[]
    {
        return this.roles.map((r) => r._id);
    }

    public get Permissions(): string[]
    {
        const permissions = Array.isArray(this.permissions) ? this.permissions : [];

        const rolesPermissions = this.roles?.filter((r) => r.enable)?.reduce<string[]>((ac, role) =>
        {
            const rolePermissions = Array.isArray(role.permissions) ? role.permissions : [];

            return [...new Set([...rolePermissions, ...ac])];
        }, []);

        return [...new Set([...permissions, ...rolesPermissions])];
    }

    public set Permissions(permissions: string | string[])
    {
        permissions = Array.isArray(permissions) ? permissions : [permissions];

        if (Array.isArray(this.permissions))
        {
            this.permissions = [...new Set([...permissions as string[], ...this.permissions])];
        }
        else
        {
            this.permissions = permissions;
        }
    }

    public verifyRolesIds(rolesIds: string[]): string[]
    {
        return rolesIds.filter(id => !this.RolesIds.includes(id));
    }

    public checkPermissions(method: 'some' | 'every', ...permissions: string[]): boolean
    {
        return permissions[method]((p: string) => this.Permissions.some((_p) => p === _p));
    }
}
