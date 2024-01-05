import { basicPropertiesMigration } from '@config/db';
import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class CreateRolesTable1691331563961 implements MigrationInterface
{
    private readonly logger = new Logger(CreateRolesTable1691331563961.name);

    public async up(queryRunner: QueryRunner): Promise<void>
    {
        void await queryRunner.createTable(
            new Table({
                name: 'roles',
                columns: [
                    ...basicPropertiesMigration,
                    new TableColumn({
                        name: 'name',
                        type: 'varchar',
                        isUnique: true
                    }),
                    new TableColumn({
                        name: 'slug',
                        type: 'varchar',
                        isUnique: true
                    }),
                    new TableColumn({
                        name: 'enable',
                        type: 'boolean',
                        default: false
                    }),
                    new TableColumn({
                        name: 'ofSystem',
                        type: 'boolean',
                        default: false
                    }),
                    new TableColumn({
                        name: 'permissions',
                        type: 'text',
                        isNullable: true
                    }),
                    new TableColumn({
                        name: 'allowedViews',
                        type: 'text',
                        isNullable: true
                    }),
                    new TableColumn({
                        name: 'scopeConfig',
                        type: 'jsonb',
                        isNullable: true
                    })
                ]
            }));
    }

    public async down(queryRunner: QueryRunner): Promise<void>
    {
        void await queryRunner.dropTable('roles');
    }
}
