import { EmailDomainTypeEnum } from '@modules/user/domain/enums';
import { SetMetadata } from '@nestjs/common';

export const CHECK_EMAIL_DOMAIN = 'check_email_domain';
export const CheckEmailDomain = (domain: EmailDomainTypeEnum | string) => SetMetadata(CHECK_EMAIL_DOMAIN, domain);
