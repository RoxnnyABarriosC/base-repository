import { User } from '@modules/user/domain/entities';
import { DisabledUserException, UserIsNotSuperAdminException } from '@modules/user/domain/exceptions';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { PermissionActions } from '@shared/app/decorators';
import { ForbiddenCustomException } from '@shared/app/exceptions';
import dayjs from 'dayjs';
import { OAuthAccountPropertiesDictionary } from '../dictionaries';
import { OAuthProviderEnum } from '../enums';
import { BadCredentialsException, BlockedAccountException } from '../exceptions';
import { EncryptionFactory } from '../factories';

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

    async localAuthenticate(emailOrPhone: string, password: string): Promise<User>
    {
        const user = await this.userRepository.findOneByEmailOrPhone({
            emailOrPhone,
            withDeleted: true
        });

        return await this.validateUser(user, password, null);
    }

    async otpAuthenticate(emailOrPhone: string, password: string,  checkFn: (user: User) => Promise<unknown> = null, checkPassword: boolean): Promise<User>
    {
        const user = await this.userRepository.findOneByEmailOrPhone({
            emailOrPhone,
            withDeleted: true
        });

        return await this.validateUser(user, password, checkFn, { checkPassword });
    }

    async jwtAuthenticate(id: string): Promise<User>
    {
        const user = await this.userRepository.getOneBy({
            condition: { _id: id },
            options: { initThrow: false },
            withDeleted: false
        });

        return await this.validateUser(user, null, null, { checkPassword: false });
    }

    async validateUser(user: User, password: string, checkFn: (user: User) => Promise<unknown> = null, { checkSuperAdmin = false, checkPassword = true } = {}): Promise<User>
    {
        if (!user)
        {
            throw new BadCredentialsException();
        }

        if (checkPassword)
        {
            void await this.checkPassword(password, user?.password.toString());
        }

        if (!user.enable)
        {
            throw new DisabledUserException();
        }

        if (checkSuperAdmin && !user.isSuperAdmin)
        {
            throw new UserIsNotSuperAdminException();
        }

        const userBlocked = (user.blocked.enable && !user.blocked.blockedAt) ||
          (user.blocked.enable && user.blocked.blockedAt && dayjs().isBefore(dayjs(user.blocked.blockedAt)));

        if (userBlocked)
        {
            throw new BlockedAccountException();
        }

        if (user.blocked.enable)
        {
            user.blocked = {
                enable: false,
                blockedAt: null
            };

            void await this.userRepository.update(user);
        }

        if (checkFn)
        {
            await checkFn(user);
        }

        if (user.deletedAt)
        {
            await this.userRepository.restore(user._id);
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

    async getOauthUser(provider: OAuthProviderEnum, accountId: string)
    {
        const condition  = {
            [OAuthAccountPropertiesDictionary.get(provider)]: accountId
        };

        return await this.userRepository.getOneBy({
            condition,
            options: {
                initThrow: false
            }
        });
    }
}

