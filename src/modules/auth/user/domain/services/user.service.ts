import { PasswordValueObject } from '@modules/auth/index/domain/valueObjects';
import { User } from '@modules/auth/user/domain/entities';
import { SuperAdminCanNotBeModifiedException } from '@modules/auth/user/domain/exceptions';
import { UserRepository } from '@modules/auth/user/infrastructure/repositories';
import { UniqueService } from '@modules/common/index/infrastructure/services';
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
                    userName: entity.userName,
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

    checkSuperAdmin(user: User): void
    {
        if (user.isSuperAdmin)
        {
            throw new SuperAdminCanNotBeModifiedException();
        }
    }
}
