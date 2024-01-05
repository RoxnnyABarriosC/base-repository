import { UserService } from '@modules/user/domain/services/user.service';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailDomainTypeEnum } from '@shared/enums';
import { GetDomainTypeOfEmail, getEmailDomain } from '@shared/utils';
import { User } from '../entities';
import {
    DontBlockYourselfException,
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
    private readonly emailAdminDomains: string[];

    constructor(
        private readonly repository: UserRepository,
        private readonly userService: UserService,
        private readonly configService: ConfigService
    )
    {
        this.emailAdminDomains = configService.getOrThrow<string[]>('emailsDomain.admin');
    }


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

    async checkDontBlockYourselfPolicy(authUserId: string, id: string, withDeleted = false): Promise<void>
    {
        const user = await this.repository.exist({ condition: { _id: id }, initThrow: true, select: ['_id'], withDeleted }) as User;

        if (user._id === authUserId)
        {
            throw new DontBlockYourselfException();
        }
    }

    async checkAdminUsersOnlyPolicy(id: string): Promise<void>
    {
        const user = await this.repository.exist({ condition: { _id: id }, initThrow: true, select: ['_id', 'email'] }) as User;

        if (GetDomainTypeOfEmail(user.email, this.emailAdminDomains) !== EmailDomainTypeEnum.ADMIN)
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
            const userEmailDomainType = GetDomainTypeOfEmail(current, this.emailAdminDomains);
            const newEmailDomainType = GetDomainTypeOfEmail(_new, this.emailAdminDomains);


            if (userEmailDomainType === EmailDomainTypeEnum.ADMIN && newEmailDomainType === EmailDomainTypeEnum.APP)
            {
                throw new UserNewEmailDomainIsNotAllowedException({ newDomain });
            }

            else if (userEmailDomainType === EmailDomainTypeEnum.APP && newEmailDomainType === EmailDomainTypeEnum.ADMIN)
            {
                throw new UserNewEmailDomainIsNotAllowedException({ newDomain });
            }
        }
    }
}
