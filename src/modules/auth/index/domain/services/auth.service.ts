import { BadCredentialsException } from '@modules/auth/index/domain/exceptions';
import { EncryptionFactory } from '@modules/auth/index/domain/factories';
import { PermissionActions } from '@modules/auth/index/presentation/decorators';
import { User } from '@modules/auth/user/domain/entities';
import { DisabledUserException, UserIsNotSuperAdminException } from '@modules/auth/user/domain/exceptions';
import { UserRepository } from '@modules/auth/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';

export interface AuthorizationDataInterface {
    isSuperAdmin: boolean;
    manage: boolean;
    allow?: boolean
}


@Injectable()
export class AuthService
{
    // private readonly logger = new Logger(AuthService.name);
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

    public getAuthorizationData(authUser: User, managePermissions: string[]): AuthorizationDataInterface
    {
        const userPermissions = authUser.Permissions;

        return  {
            isSuperAdmin: authUser?.isSuperAdmin,
            manage: userPermissions.some(p => managePermissions.includes(p))
        };
    }
}

