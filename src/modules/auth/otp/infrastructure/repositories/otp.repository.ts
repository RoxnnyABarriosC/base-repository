import { OTP } from '@modules/auth/otp/domain/entities';
import { OtpTypeEnum } from '@modules/auth/otp/domain/enums/otp-type.enum';
import { OTPSchema } from '@modules/auth/otp/infrastructure/schemas';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '@shared/abstractClass';
import { Repository } from 'typeorm';

@Injectable()
export class OTPRepository extends BaseRepository<OTP>
{
    private readonly logger = new Logger(OTPRepository.name);

    constructor(@InjectRepository(OTPSchema) repository: Repository<OTP>)
    {
        super(OTP, repository);
    }

    async getOTPByUserId(userId: string)
    {
        return await this.repository.createQueryBuilder('i')
            .innerJoinAndSelect('i.user', 'u')
            .where('i.user_id = :userId', { userId })
            .getOne();
    }

    async restartingAttempts(): Promise<void>
    {
        const queryBuilder = this.repository.createQueryBuilder().update();

        Object.keys(OtpTypeEnum).forEach((key) =>
        {
            queryBuilder.set({
                config: () => `jsonb_set(config::jsonb, '{${OtpTypeEnum[key]}, attempts}','0')`
            });
        });

        await queryBuilder.execute();
    }
}
