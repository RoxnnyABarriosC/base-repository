import { SecurityConfig } from '@modules/securityConfig/domain/entities';
import { User } from '@modules/user/domain/entities';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundCustomException } from '@shared/app/exceptions';
import { BaseRepository } from '@shared/typeOrm/abstractClass';
import { addTimeToCurrentDate } from '@shared/utils';
import { Repository } from 'typeorm';
import { SecurityConfigSchema } from '../schemas';

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

        queryBuilder.set({ otpAttempts: 0 });

        await queryBuilder.execute();
    }

    async getConfigOfEmailOrPhone(emailOrPhone: string): Promise<SecurityConfig>
    {
        const queryBuilder = this.repository.createQueryBuilder('sc');
        queryBuilder.withDeleted();

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

    async getConfigOfEmailOrPhoneV2(emailOrPhone: string): Promise<SecurityConfig>
    {
        const entity = await this.repository.findOne({
            where: {
                user: [{ email: emailOrPhone }, { phone: emailOrPhone }]
            },
            select: {
                _id: true,
                otp: true,
                otpAttempts: true,
                requiredPassword: true,
                user: {
                    _id: true,
                    email: true,
                    phone: true
                }
            } as any,
            relations: {
                user: true
            }
        });

        if (!entity)
        {
            throw new NotFoundCustomException(User.name);
        }

        return entity;
    }

    async tempBlockedAt(id: string, time: number)
    {
        const tempBlockedAt = addTimeToCurrentDate(`${time}s`).toDate();

        await this.repository.update({ _id: id } as any, { tempBlockedAt, blockedTime: time, authAttempts: 0 });

        return tempBlockedAt;
    }

    async incrementAttempts(id: string)
    {
        await this.repository.update({ _id: id } as any, { authAttempts: () => 'authAttempts + 1' });
    }

    async setAuthAttempts(id: string, authAttempts = 0)
    {
        await this.repository.update({ _id: id } as any, { authAttempts });
    }

    async resetTempBlock(id: string)
    {
        await this.repository.update({ _id: id } as any, { tempBlockedAt: null, blockedTime: 0, authAttempts: 0 });
    }
}
