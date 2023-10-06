import dataSource from '@config/db/data-source';
import { OTP } from '@modules/auth/otp/domain/entities';
import { User } from '@modules/auth/user/domain/entities';
import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOtpConfigToUsersSeed1696517329825 implements MigrationInterface
{
    private readonly logger = new Logger(AddOtpConfigToUsersSeed1696517329825.name);

    public async up(queryRunner: QueryRunner): Promise<void>
    {
        const usersWithoutOtpConfig = await dataSource
            .manager.createQueryBuilder(User, 'u')
            .leftJoin('u.otp', 'otp')
            .where('otp._id IS NULL')
            .getMany();

        const newOtpConfigs =  usersWithoutOtpConfig.map((user) =>
        {
            const otp = new OTP();
            otp.User = user;

            return otp;
        });

        void await dataSource.manager.save(OTP, newOtpConfigs);
    }

    public async down(queryRunner: QueryRunner): Promise<void>
    {
        this.logger.log('revert');
    }
}
