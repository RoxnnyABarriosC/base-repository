import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddBlockedControlColumns1704577457901 implements MigrationInterface
{
    private readonly logger = new Logger(AddBlockedControlColumns1704577457901.name);

    public async up(queryRunner: QueryRunner): Promise<void>
    {
        void await queryRunner.addColumns('security_configs', [
            new TableColumn({
                name: 'authAttempts',
                type: 'int',
                default: 0
            }),
            new TableColumn({
                name: 'blockedTime',
                type: 'int',
                default: 0
            }),
            new TableColumn({
                name: 'tempBlockedAt',
                type: 'timestamp',
                isNullable: true
            })
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void>
    {
        void await queryRunner.dropColumns('security_configs', ['authAttempts', 'blockedTime', 'tempBlockedAt']);
    }
}
