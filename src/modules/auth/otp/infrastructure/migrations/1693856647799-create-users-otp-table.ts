import { basicPropertiesMigration } from '@config/db';
import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class CreateUsersOtpTable1693856647799 implements MigrationInterface
{
    private readonly logger = new Logger(CreateUsersOtpTable1693856647799.name);

    public async up(queryRunner: QueryRunner): Promise<void>
    {
        void await queryRunner.createTable(
            new Table({
                name: 'otps',
                columns: [
                    ...basicPropertiesMigration,
                    new TableColumn({
                        name: 'config',
                        type: 'jsonb'
                    }),
                    new TableColumn({
                        name: 'user_id',
                        type: 'uuid',
                        isNullable: true,
                        isUnique: true
                    })
                ],
                foreignKeys: [
                    new TableForeignKey({
                        columnNames: ['user_id'],
                        referencedColumnNames: ['_id'],
                        referencedTableName: 'users',
                        onDelete: 'CASCADE'
                    })
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void>
    {
        void await queryRunner.dropTable('otps');
    }
}
