import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, TableCheck, TableColumn } from 'typeorm';

export class AddBlockedColumn1704470158680 implements MigrationInterface
{
    private readonly logger = new Logger(AddBlockedColumn1704470158680.name);

    public async up(queryRunner: QueryRunner): Promise<void>
    {
        void await queryRunner.addColumn('users',  new TableColumn({
            name: 'blocked',
            type: 'jsonb',
            default: '\'{"enable": false, "blockedAt": null}\'::jsonb'
        }));

        void await queryRunner.createCheckConstraint('users',  new TableCheck({
            name: 'BLOCKED_USER_CHECK',
            columnNames: ['blocked'],
            expression: `
                  ((blocked->>'enable')::boolean = false AND (blocked->>'blockedAt' IS NULL)) OR
                  (
                    (blocked->>'enable')::boolean = true AND
                    (blocked->>'blockedAt' IS NULL OR (blocked->>'blockedAt')::timestamp IS NOT NULL)
                  )
            `
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void>
    {
        void await queryRunner.dropColumn('users', 'blocked');
    }
}
