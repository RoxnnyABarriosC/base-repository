import { CreateUsersTable1691331857829 } from '@modules/user/infrastructure/migrations/1691331857829-create-users-table';
import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class SetNullPhoneColum1700757359041 implements MigrationInterface
{
    private readonly logger = new Logger(CreateUsersTable1691331857829.name);

    public async up(queryRunner: QueryRunner): Promise<void>
    {
        void await queryRunner.changeColumn('users',
            new TableColumn({
                name: 'phone',
                type: 'varchar',
                isUnique: true
            }),
            new TableColumn({
                name: 'phone',
                type: 'varchar',
                isUnique: true,
                isNullable: true
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void>
    {
        void await queryRunner.changeColumn('users',
            new TableColumn({
                name: 'phone',
                type: 'varchar',
                isUnique: true,
                isNullable: true
            }),
            new TableColumn({
                name: 'phone',
                type: 'varchar',
                isUnique: true
            })
        );
    }
}
