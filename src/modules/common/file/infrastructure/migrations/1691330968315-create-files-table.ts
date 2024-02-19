import { basicPropertiesMigration } from '@config/db';
import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class CreateFilesTable1691330968315 implements MigrationInterface
{
    private readonly logger = new Logger(CreateFilesTable1691330968315.name);

    public async up(queryRunner: QueryRunner): Promise<void>
    {
        void await queryRunner.createTable(
            new Table({
                name: 'files',
                columns: [
                    ...basicPropertiesMigration,
                    new TableColumn({
                        name: 'name',
                        type: 'varchar',
                        isUnique: true
                    }),
                    new TableColumn({
                        name: 'originalName',
                        type: 'varchar'
                    }),
                    new TableColumn({
                        name: 'contentType',
                        type: 'varchar'
                    }),
                    new TableColumn({
                        name: 'mimeType',
                        type: 'varchar'
                    }),
                    new TableColumn({
                        name: 'extension',
                        type: 'varchar'
                    }),
                    new TableColumn({
                        name: 'path',
                        type: 'varchar',
                        isUnique: true
                    }),
                    new TableColumn({
                        name: 'size',
                        type: 'integer'
                    }),
                    new TableColumn({
                        name: 'isPrivate',
                        type: 'boolean',
                        default: true
                    })
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void>
    {
        void await queryRunner.dropTable('files');
    }
}
