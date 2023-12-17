import { EmailDomainTypeEnum } from '@shared/enums';
import { getEmailDomain } from '@shared/utils';

export const GetDomainTypeOfEmail = (email: string, emailsAdminDomains: string[]): EmailDomainTypeEnum =>
{
    const domain = getEmailDomain(email);

    if (emailsAdminDomains.includes(domain))
    {
        return EmailDomainTypeEnum.ADMIN;
    }
    else
    {
        return EmailDomainTypeEnum.APP;
    }
};
