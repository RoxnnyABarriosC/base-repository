import { PasswordValueObject } from '@modules/auth/domain/valueObjects';
import { UniqueService } from '@modules/common/index/infrastructure/services';
import { User } from '@modules/user/domain/entities';
import { DontDeleteYourselfException, SuperAdminCanNotBeModifiedException } from '@modules/user/domain/exceptions';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService
{
    constructor(
        private readonly uniqueService: UniqueService,
        private readonly repository: UserRepository
    )
    { }

    async validate(entity: User): Promise<void>
    {
        void await this.uniqueService.validate<User>({
            repository: UserRepository,
            validate: {
                only: {
                    email: entity.email,
                    phone: entity.phone
                }
            },
            refValue: entity._id
        });
    }

    async preparePassword(password: string): Promise<PasswordValueObject>
    {
        return  await (new PasswordValueObject(password, 5, 30)).ready();
    }

    async checkSuperAdminPolicy(id: string, withDeleted = false): Promise<void>
    {
        const user = await this.repository.exist({ condition: { _id: id }, initThrow: true, select: ['isSuperAdmin', '_id'], withDeleted }) as User;

        if (user.isSuperAdmin)
        {
            throw new SuperAdminCanNotBeModifiedException();
        }
    }

    async checkYourselfPolicy(authUserId: string, id: string, withDeleted = false): Promise<void>
    {
        const user = await this.repository.exist({ condition: { _id: id }, initThrow: true, select: ['_id'], withDeleted }) as User;

        if (user._id === authUserId)
        {
            throw new DontDeleteYourselfException();
        }
    }

    async getEmailAndPhone(emailOrPhone: string)
    {
        return await this.repository.exist({
            condition: [{ email: emailOrPhone }, { phone: emailOrPhone }],
            select: ['phone', 'email']
        });
    }
}
