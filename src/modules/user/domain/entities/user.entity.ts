import configuration from '@config/configuration';
import { PasswordValueObject } from '@modules/auth/domain/valueObjects';
import { File } from '@modules/common/file/domain/entities';
import { Role } from '@modules/role/domain/entities';
import { SecurityConfig } from '@modules/securityConfig/domain/entities';
import { IBlockedUser } from '@modules/user/domain/entities/blocked-user.interface';
import { BaseEntity } from '@shared/app/entities';
import { GetDomainTypeOfEmail } from '@shared/utils';
import { Exclude, Expose } from 'class-transformer';
import { GenderEnum } from '../enums';

const emailAdminDomain = configuration().emailsDomain.admin;

@Exclude()
export class User extends BaseEntity
{
    @Expose() public userName: string;
    @Expose() public userNameId: string;
    @Expose() public firstName: string;
    @Expose() public lastName: string;
    @Expose() public email: string;
    @Expose() public phone?: string;
    @Expose() public gender?: GenderEnum;
    @Expose() public birthday?: Date;
    @Expose() public enable: boolean;
    @Expose() public verify: boolean;
    @Expose() public onBoarding: boolean;
    @Expose() public isSuperAdmin: boolean;
    public password: PasswordValueObject | string;
    @Expose() public permissions?: string[];
    @Expose() public passwordRequestedAt?: Date | number;
    @Expose() public roles: Role[];
    @Expose() public mainPicture?: File;
    @Expose() public banner?: File;
    @Expose() public securityConfig: Promise<SecurityConfig>;
    @Expose() public facebookAccountId?: string;
    @Expose() public googleAccountId?: string;
    @Expose() public appleAccountId?: string;
    @Expose() public blocked?: IBlockedUser;

    constructor(data?: Partial<User>, validate?: boolean)
    {
        super();
        this.build(data, validate);
    }

    public get FullName()
    {
        return `${this.firstName} ${this.lastName}`;
    }

    public get UserName()
    {
        return `${this.userName}#${this.userNameId}`;
    }

    public get Target()
    {
        return GetDomainTypeOfEmail(this.email, emailAdminDomain);
    }

    public cleanRoles(): void
    {
        this.roles = [];
    }

    public set Role(roles: Role | Role[])
    {
        roles = Array.isArray(roles) ? roles : [roles];

        if (!Array.isArray(this.roles))
        {
            this.roles = [];
        }

        const roleIds = new Set(this.roles.map(role => role?._id));

        const newRoles = roles.filter(role => !roleIds.has(role._id));

        this.roles.push(...newRoles);
    }

    public get RolesIds(): string[]
    {
        return this.roles.map((r) => r._id);
    }

    public get Permissions(): string[]
    {
        const permissions = Array.isArray(this.permissions) ? this.permissions : [];
        const roles = Array.isArray(this.roles) ? this.roles : [];

        const rolesPermissions = roles?.filter((r) => r.enable)?.reduce<string[]>((ac, role) =>
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
