import { SetMetadata } from '@nestjs/common';
import { EmailDomainTypeEnum } from '@shared/enums';

export const CHECK_EMAIL_DOMAIN = 'check_email_domain';
export const CheckEmailDomain = (domain: EmailDomainTypeEnum | string) => SetMetadata(CHECK_EMAIL_DOMAIN, domain);
