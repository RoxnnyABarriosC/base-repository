import { EmailDomainNotValidException } from '@modules/auth/domain/exceptions';
import { RequestAuth } from '@modules/auth/domain/strategies';
import { EmailDomainTypeEnum } from '@modules/user/domain/enums';
import { UserService } from '@modules/user/domain/services';
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef, Reflector } from '@nestjs/core';
import { CHECK_EMAIL_DOMAIN, checkIsPublic } from '../decorators';

@Injectable()
export class CheckEmailDomainGuard implements CanActivate
{
    private readonly logger = new Logger(CheckEmailDomainGuard.name);
    private readonly userService: UserService;

    constructor(
        private readonly reflector: Reflector,
        private readonly moduleRef: ModuleRef,
        private readonly configService: ConfigService
    )
    {
        this.userService = this.moduleRef.get(UserService, { strict: false });
    }

    async canActivate(context: ExecutionContext): Promise<boolean>
    {
        if (checkIsPublic(context, this.reflector))
        {
            return true;
        }

        const checkEmailDomain = this.reflector.getAllAndOverride<EmailDomainTypeEnum>(CHECK_EMAIL_DOMAIN, [
            context.getHandler(),
            context.getClass()
        ]) ?? undefined;

        const { user: { data } } = context.switchToHttp().getRequest<RequestAuth>();

        if (checkEmailDomain)
        {
            const emailDomainType = this.userService.getDomainTypeOfEmail(data.email);

            if (emailDomainType !== checkEmailDomain)
            {
                throw new EmailDomainNotValidException(this.configService.getOrThrow<string>(`emailsDomain.${checkEmailDomain}`).split(','));
            }
        }

        return true;
    }
}
