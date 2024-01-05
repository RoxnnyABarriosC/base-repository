import { basicPropertiesMigration } from '@config/db';
import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, Table, TableCheck, TableColumn, TableForeignKey } from 'typeorm';

export class CreateUsersSecurityConfigTable1693856647799 implements MigrationInterface
{
    private readonly logger = new Logger(CreateUsersSecurityConfigTable1693856647799.name);

    public async up(queryRunner: QueryRunner): Promise<void>
    {
        void await queryRunner.createTable(
            new Table({
                name: 'security_configs',
                columns: [
                    ...basicPropertiesMigration,
                    new TableColumn({
                        name: 'otp',
                        type: 'jsonb',
                        default: '\'{"phone": { "enable": false, "providers": [] }, "email": { "enable": false }}\'::jsonb'
                    }),
                    new TableColumn({
                        name: 'otpAttempts',
                        type: 'int',
                        default: 0
                    }),
                    new TableColumn({
                        name: 'oldPassword',
                        type: 'varchar',
                        isNullable: true
                    }),
                    new TableColumn({
                        name: 'requiredPassword',
                        type: 'boolean',
                        default: true
                    }),
                    new TableColumn({
                        name: 'user_id',
                        type: 'uuid',
                        isNullable: false,
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
                ],
                checks: [
                    new TableCheck({
                        name: 'REQUIRED_PASSWORD_CHECK',
                        columnNames: ['requiredPassword', 'otp'],
                        expression: '"requiredPassword" = true OR (otp->\'phone\'->>\'enable\' = \'true\' OR otp->\'email\'->>\'enable\' = \'true\')'
                    })
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void>
    {
        void await queryRunner.dropTable('security_configs');
    }
}
