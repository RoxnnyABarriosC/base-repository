import { PasswordValueObject } from '@modules/auth/domain/valueObjects';
import { UniqueService } from '@modules/common/index/infrastructure/services';
import { UserRepository } from '@modules/user/infrastructure/repositories';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getEmailDomain } from '@shared/utils';
import { User } from '../entities';
import { EmailDomainTypeEnum } from '../enums';

@Injectable()
export class UserService
{
    constructor(
        private readonly uniqueService: UniqueService,
        private readonly repository: UserRepository,
        private readonly configService: ConfigService
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


    async getEmailAndPhone(emailOrPhone: string)
    {
        return await this.repository.exist({
            condition: [{ email: emailOrPhone }, { phone: emailOrPhone }],
            select: ['phone', 'email']
        });
    }


    getDomainTypeOfEmail(email: string): EmailDomainTypeEnum
    {
        const emailsAppDomain = this.configService.getOrThrow<string>('emailsDomain.app').split(',');
        const emailsAdminDomain = this.configService.getOrThrow<string>('emailsDomain.admin').split(',');

        const domain = getEmailDomain(email);

        if (emailsAppDomain.includes(domain))
        {
            return EmailDomainTypeEnum.APP;
        }

        if (emailsAdminDomain.includes(domain))
        {
            return EmailDomainTypeEnum.ADMIN;
        }
    }
}
