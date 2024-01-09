import { EmailDomainNotValidException } from '@modules/auth/domain/exceptions';
import { RequestAuth, SocketAuth } from '@modules/auth/domain/strategies';
import { UserService } from '@modules/user/domain/services';
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef, Reflector } from '@nestjs/core';
import { CHECK_EMAIL_DOMAIN, checkIsPublic } from '@shared/app/decorators';
import { EmailDomainTypeEnum } from '@shared/enums';
import { GetDomainTypeOfEmail } from '@shared/utils';

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

        let request: RequestAuth | SocketAuth = context.switchToHttp().getRequest<RequestAuth>();

        if (context['contextType'] === 'ws')
        {
            request = context.switchToWs().getClient<SocketAuth>();
        }

        const { user: { data } } = request;

        if (checkEmailDomain)
        {
            const emailAdminDomains =  this.configService.getOrThrow<string[]>('emailsDomain.admin');

            const emailDomainType = GetDomainTypeOfEmail(data.email, emailAdminDomains);

            if (emailDomainType !== checkEmailDomain)
            {
                throw new EmailDomainNotValidException({ [emailDomainType === EmailDomainTypeEnum.ADMIN ? 'notAllow' : 'allow' ]: emailAdminDomains });
            }
        }

        return true;
    }
}
