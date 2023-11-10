import { SecurityConfig } from '@modules/securityConfig/domain/entities';
import { OTPSendTypeEnum } from '@modules/securityConfig/domain/enums/otp-send-type.enum';
import { SecurityConfigSchema } from '@modules/securityConfig/infrastructure/schemas';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '@shared/abstractClass';
import { NotFoundCustomException } from '@shared/exceptions';
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

    async getConfigOfEmailOrPhone(emailOrPhone: string): Promise<SecurityConfig>
    {
        const queryBuilder = this.repository.createQueryBuilder('sc');

        void queryBuilder.innerJoin('sc.user', 'user');

        void queryBuilder.where('user.email = :emailOrPhone', { emailOrPhone });
        void queryBuilder.orWhere('user.phone = :emailOrPhone', { emailOrPhone });


        const entity = await queryBuilder.getOne();

        if (!entity)
        {
            throw new NotFoundCustomException(this.entityClass.name);
        }

        return entity;
    }
}
