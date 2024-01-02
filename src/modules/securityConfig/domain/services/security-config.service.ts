import { BadCredentialsException } from '@modules/auth/domain/exceptions';
import { EncryptionFactory } from '@modules/auth/domain/factories';
import { SecurityConfigRepository } from '@modules/securityConfig/infrastructure/repositories';
import { User } from '@modules/user/domain/entities';
import {  Injectable, Logger } from '@nestjs/common';
import { SecurityConfig } from '../entities';
import { CannotUseYourOldPasswordException } from '../exceptions';

@Injectable()
export class SecurityConfigService
{
    private readonly logger = new Logger(SecurityConfigService.name);
    public readonly encryption = EncryptionFactory.create();

    constructor(
        private readonly repository: SecurityConfigRepository
    )
    { }

    async checkOldPassword(user: User, password: string): Promise<void>
    {
        const securityConfig = await user.securityConfig;

        if (securityConfig.oldPassword)
        {
            if (await this.encryption.compare(password, securityConfig.oldPassword))
            {
                throw new CannotUseYourOldPasswordException();
            }
        }

        securityConfig.oldPassword = user.password.toString();

        void await this.repository.update(securityConfig);
    }

    async getConfigOfEmailOrPhone(emailOrPhone: string): Promise<SecurityConfig>
    {
        try
        {
            return await this.repository.getConfigOfEmailOrPhone(emailOrPhone);
        }
        catch (e)
        {
            this.logger.error(e);
            throw new BadCredentialsException();
        }
    }
}
