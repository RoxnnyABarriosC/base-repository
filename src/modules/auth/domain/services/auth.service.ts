import { SecurityConfig } from '@modules/securityConfig/domain/entities';
import { SecurityConfigRepository } from '@modules/securityConfig/infrastructure/repositories';
import { User } from '@modules/user/domain/entities';
import { DisabledUserException, UnverifiedUserException, UserIsNotSuperAdminException } from '@modules/user/domain/exceptions';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PermissionActions } from '@shared/app/decorators';
import dayjs from 'dayjs';
import { OAuthAccountPropertiesDictionary } from '../dictionaries';
import { OAuthProviderEnum } from '../enums';
import { AuthAttemptsExceededException, BadCredentialsException, BlockedAccountException, TemporalBlockedAccountException } from '../exceptions';
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
        private readonly userRepository: UserRepository,
        private readonly securityRepository: SecurityConfigRepository,
        private readonly configService: ConfigService,
        private readonly eventEmitter: EventEmitter2
    )
    { }

    async localAuthenticate(emailOrPhone: string, password: string): Promise<User>
    {
        const user = await this.userRepository.findOneByEmailOrPhone({
            emailOrPhone,
            withDeleted: true
        });

        return await this.validateUser(user, password, null, { checkTempBlock: true });
    }

    async otpAuthenticate(emailOrPhone: string, password: string,  checkFn: (user: User) => Promise<unknown> = null, checkPassword: boolean): Promise<User>
    {
        const user = await this.userRepository.findOneByEmailOrPhone({
            emailOrPhone,
            withDeleted: true
        });

        return await this.validateUser(user, password, checkFn, { checkPassword, checkTempBlock: true });
    }

    async jwtAuthenticate(id: string): Promise<User>
    {
        const user = await this.userRepository.getOneBy({
            condition: { _id: id },
            initThrow: false,
            withDeleted: false
        });

        return await this.validateUser(user, null, null, { checkPassword: false, restoreTemporalBlock: false });
    }

    async validateUser(
        user: User,
        password: string,
      checkFn: (user: User) => Promise<unknown> = null,
      { checkSuperAdmin = false, checkPassword = true, checkTempBlock = false, restoreTemporalBlock = true } = {}
    ): Promise<User>
    {
        this.checkUserValidity(user, checkSuperAdmin, checkTempBlock);

        const securityConfig = await user.securityConfig;

        if (checkTempBlock)
        {
            await this.handleTempBlockValidation(securityConfig);
        }

        if (checkPassword)
        {
            await this.checkPasswordAndHandleSecurity(user, password, securityConfig, checkTempBlock);
        }

        if (checkFn)
        {
            await this.handleCustomCheckFunction(user, checkFn, securityConfig, checkTempBlock);
        }

        if (restoreTemporalBlock)
        {
            await this.handleUserRestorationAndTempBlockReset(user, securityConfig);
        }

        return user;
    }

    private checkUserValidity(user: User, checkSuperAdmin: boolean, checkTempBlock: boolean): void
    {
        if (!user)
        {
            throw new BadCredentialsException();
        }

        if (!user.enable)
        {
            throw new DisabledUserException();
        }

        if (!user.verify)
        {
            throw new UnverifiedUserException();
        }

        if (checkSuperAdmin && !user.isSuperAdmin)
        {
            throw new UserIsNotSuperAdminException();
        }

        const userBlocked = this.isUserBlocked(user);

        if (userBlocked)
        {
            throw new BlockedAccountException();
        }
    }

    private isUserBlocked(user: User): boolean
    {
        return (user.blocked.enable && !user.blocked.blockedAt) ||
          (user.blocked.enable && user.blocked.blockedAt && dayjs().isBefore(dayjs(user.blocked.blockedAt)));
    }

    private async handleTempBlockValidation(securityConfig: SecurityConfig): Promise<void>
    {
        if (securityConfig?.tempBlockedAt && dayjs().isBefore(dayjs(securityConfig.tempBlockedAt)))
        {
            throw new TemporalBlockedAccountException(securityConfig.blockedTime, securityConfig.tempBlockedAt);
        }

        if (securityConfig?.tempBlockedAt)
        {
            securityConfig.authAttempts = 0;
            securityConfig.tempBlockedAt = null;

            await this.securityRepository.update(securityConfig);
        }

        const authAttempts = this.configService.getOrThrow<number>('temporalBlock.attempts');
        const blockedTime = this.configService.getOrThrow<number>('temporalBlock.time');

        if (securityConfig.authAttempts > (authAttempts - 1))
        {
            let time = securityConfig.blockedTime || blockedTime;

            if (securityConfig.blockedTime)
            {
                time = time * 2;
            }

            throw new AuthAttemptsExceededException(time, await this.securityRepository.tempBlockedAt(securityConfig._id, time));
        }
    }

    private async checkPasswordAndHandleSecurity(user: User, password: string, securityConfig: SecurityConfig, checkTempBlock: boolean): Promise<void>
    {
        try
        {
            await this.checkPassword(password, user?.password.toString());
        }
        catch (e)
        {
            if (checkTempBlock)
            {
                await this.securityRepository.incrementAttempts(securityConfig._id);
            }
            throw e;
        }
    }

    private async handleCustomCheckFunction(user: User, checkFn: (user: User) => Promise<unknown>, securityConfig: SecurityConfig, checkTempBlock: boolean): Promise<void>
    {
        try
        {
            await checkFn(user);
        }
        catch (e)
        {
            if (checkTempBlock)
            {
                await this.securityRepository.incrementAttempts(securityConfig._id);
            }
            throw e;
        }
    }

    private async handleUserRestorationAndTempBlockReset(user: User, securityConfig: SecurityConfig): Promise<void>
    {
        if (user.deletedAt)
        {
            await this.userRepository.restore({ id: user._id });
        }

        if (securityConfig.blockedTime)
        {
            await this.securityRepository.resetTempBlock(securityConfig._id);
        }
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
            initThrow: false
        });
    }
}

