import { BadCredentialsException } from '@modules/auth/domain/exceptions';
import { EncryptionFactory } from '@modules/auth/domain/factories';
import { PermissionActions } from '@modules/auth/presentation/decorators';
import { User } from '@modules/user/domain/entities';
import { DisabledUserException, UserIsNotSuperAdminException } from '@modules/user/domain/exceptions';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';

export interface IAuthorizationData
{
    isSuperAdmin: boolean;
    manage: boolean;
    allow?: boolean
}


@Injectable()
export class AuthService
{
    private readonly logger = new Logger(AuthService.name);
    private readonly encryption = EncryptionFactory.create();

    constructor(
        private readonly userRepository: UserRepository
    )
    { }

    async validateUser(emailOrPhone: string, password: string, checkSuperAdmin = false): Promise<User>
    {
        const user = await this.userRepository.findOneByEmailOrPhone({
            emailOrPhone
        });

        if (!user)
        {
            throw new BadCredentialsException();
        }

        void await this.checkPassword(password, user?.password.toString());

        if (!user.enable)
        {
            throw new DisabledUserException();
        }

        if (checkSuperAdmin && !user.isSuperAdmin)
        {
            throw new UserIsNotSuperAdminException();
        }

        return user;
    }

    async checkPassword(password: string, userPassword: string): Promise<void>
    {
        if (!await this.encryption.compare(password, userPassword))
        {
            throw new BadCredentialsException();
        }
    }

    public async authorize(authUser: User, handlerPermissions: string[], method: PermissionActions): Promise<boolean>
    {
        const userPermissions = authUser.Permissions;

        return handlerPermissions[method]((hp: string) => userPermissions.some((permission) => hp === permission));
    }

    public getAuthorizationData(authUser: User, managePermissions: string[]): IAuthorizationData
    {
        const userPermissions = authUser.Permissions;

        return  {
            isSuperAdmin: authUser?.isSuperAdmin,
            manage: userPermissions.some(p => managePermissions.includes(p))
        };
    }
}

