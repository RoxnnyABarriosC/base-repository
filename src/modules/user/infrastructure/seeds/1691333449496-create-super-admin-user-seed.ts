import dataSource from '@config/db/data-source';
import { User } from '@modules/user/domain/entities';
import { GenderEnum } from '@modules/user/domain/enums';
import { Logger } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { MigrationInterface, QueryRunner } from 'typeorm';
import fs from 'fs';
import { SuperAdminDataInterface } from './super-admin-data.interface';

export class CreateSuperAdminUserSeed1691333449496 implements MigrationInterface
{
    private readonly logger = new Logger(CreateSuperAdminUserSeed1691333449496.name);

    public async up(queryRunner: QueryRunner): Promise<void>
    {
        const {  password, ...data  }: SuperAdminDataInterface = JSON.parse(fs.readFileSync('./super-admin-data.json', 'utf-8'));

        const superAdmin = new User({
            ...data,
            isSuperAdmin: true,
            enable: true,
            verify: true,
            gender: GenderEnum.MALE,
            password: { value: await bcrypt.hash(password, 10) } as any
        }, false);

        void await dataSource.manager.save(User, superAdmin);
    }

    public async down(queryRunner: QueryRunner): Promise<void>
    {
        this.logger.log('revert');
    }
}
