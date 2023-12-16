import { EmailDomainTypeEnum } from '@modules/user/domain/enums';
import { UserService } from '@modules/user/domain/services/user.service';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getEmailDomain } from '@shared/utils';
import { User } from '../entities';
import {
    DontDeleteYourselfException,
    OnlySuperAdminCanUpdateEmailException,
    OnlySuperAdminCanUpdateUserNameException,
    SuperAdminCanNotBeModifiedException,
    UserIsNotAdminException,
    UserNewEmailDomainIsNotAllowedException
} from '../exceptions';

@Injectable()
export class UserPolicyService
{
    constructor(
        private readonly repository: UserRepository,
        private readonly userService: UserService,
        private readonly configService: ConfigService
    )
    { }


    async checkSuperAdminCanNotBeModifiedPolicy(id: string, withDeleted = false): Promise<void>
    {
        const user = await this.repository.exist({ condition: { _id: id }, initThrow: true, select: ['isSuperAdmin', '_id'], withDeleted }) as User;

        if (user.isSuperAdmin)
        {
            throw new SuperAdminCanNotBeModifiedException();
        }
    }

    async checkDontDeleteYourselfPolicy(authUserId: string, id: string, withDeleted = false): Promise<void>
    {
        const user = await this.repository.exist({ condition: { _id: id }, initThrow: true, select: ['_id'], withDeleted }) as User;

        if (user._id === authUserId)
        {
            throw new DontDeleteYourselfException();
        }
    }

    async checkAdminUsersOnlyPolicy(id: string): Promise<void>
    {
        const user = await this.repository.exist({ condition: { _id: id }, initThrow: true, select: ['_id', 'email'] }) as User;

        if (this.userService.getDomainTypeOfEmail(user.email) !== EmailDomainTypeEnum.ADMIN)
        {
            throw new UserIsNotAdminException();
        }
    }

    async checkDomainEmailUpdatePolicy(id: string, newEmail: string)
    {
        const user = await this.repository.exist({ condition: { _id: id }, initThrow: true, select: ['_id', 'email'] }) as User;

        this.checkDomainEmailUpdate(user.email, newEmail);
    }

    checkAdminCantUpdateEmailPolicy(user: User, existEmail: boolean): void
    {
        if (!user.isSuperAdmin && existEmail)
        {
            throw new OnlySuperAdminCanUpdateEmailException();
        }
    }

    checkAdminCantUpdateUserNamePolicy(user: User, existUserName: boolean): void
    {
        if (!user.isSuperAdmin && existUserName)
        {
            throw new OnlySuperAdminCanUpdateUserNameException();
        }
    }


    private checkDomainEmailUpdate(current: string, _new: string)
    {
        const currentDomain = getEmailDomain(current);
        const newDomain = getEmailDomain(_new);

        if (newDomain !== currentDomain)
        {
            if (this.userService.getDomainTypeOfEmail(current) === EmailDomainTypeEnum.APP
              && this.userService.getDomainTypeOfEmail(_new) !== EmailDomainTypeEnum.APP)
            {
                throw new UserNewEmailDomainIsNotAllowedException(this.configService
                    .getOrThrow<string>('emailsDomain.app').split(','));
            }

            if (this.userService.getDomainTypeOfEmail(current) === EmailDomainTypeEnum.ADMIN
              && this.userService.getDomainTypeOfEmail(_new) !== EmailDomainTypeEnum.ADMIN)
            {
                throw new UserNewEmailDomainIsNotAllowedException(this.configService
                    .getOrThrow<string>('emailsDomain.admin').split(','));
            }
        }
    }
}
