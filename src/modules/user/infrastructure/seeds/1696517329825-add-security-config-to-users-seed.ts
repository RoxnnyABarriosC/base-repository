import dataSource from '@config/db/data-source';
import { SecurityConfig } from '@modules/securityConfig/domain/entities';
import { User } from '@modules/user/domain/entities';
import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSecurityConfigToUsersSeed1696517329825 implements MigrationInterface
{
    private readonly logger = new Logger(AddSecurityConfigToUsersSeed1696517329825.name);

    public async up(queryRunner: QueryRunner): Promise<void>
    {
        const usersWithoutOtpConfig = await dataSource
            .manager.createQueryBuilder(User, 'u')
            .leftJoin('u.securityConfig', 'sc')
            .where('sc._id IS NULL')
            .getMany();

        const newSecurityConfigs =  usersWithoutOtpConfig.map((user) =>
        {
            const securityConfig = new SecurityConfig();
            securityConfig.User = user;

            return securityConfig;
        });

        void await dataSource.manager.save(SecurityConfig, newSecurityConfigs);
    }

    public async down(queryRunner: QueryRunner): Promise<void>
    {
        this.logger.log('revert');
    }
}
