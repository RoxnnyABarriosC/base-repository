import { SecurityConfig } from '@modules/securityConfig/domain/entities';
import { OTPSendTypeEnum } from '@modules/securityConfig/domain/enums/otp-send-type.enum';
import { SecurityConfigSchema } from '@modules/securityConfig/infrastructure/schemas';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '@shared/abstractClass';
import { Repository } from 'typeorm';

@Injectable()
export class SecurityConfigRepository extends BaseRepository<SecurityConfig>
{
    private readonly logger = new Logger(SecurityConfigRepository.name);

    constructor(@InjectRepository(SecurityConfigSchema) repository: Repository<SecurityConfig>)
    {
        super(SecurityConfig, repository);
    }

    async restartingAttempts(): Promise<void>
    {
        const queryBuilder = this.repository.createQueryBuilder().update();

        Object.keys(OTPSendTypeEnum).forEach((key) =>
        {
            queryBuilder.set({
                otp: () => `jsonb_set(config::jsonb, '{${OTPSendTypeEnum[key]}, attempts}','0')`
            });
        });

        await queryBuilder.execute();
    }
}
