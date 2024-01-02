import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddSocialColumns1701395391630 implements MigrationInterface
{
    private readonly logger = new Logger(AddSocialColumns1701395391630.name);

    public async up(queryRunner: QueryRunner): Promise<void>
    {
        void await queryRunner.addColumns('users',
            [
                new TableColumn({
                    name: 'facebookAccountId',
                    type: 'varchar',
                    isUnique: true,
                    isNullable: true
                }),
                new TableColumn({
                    name: 'googleAccountId',
                    type: 'varchar',
                    isUnique: true,
                    isNullable: true
                }),
                new TableColumn({
                    name: 'appleAccountId',
                    type: 'varchar',
                    isUnique: true,
                    isNullable: true
                })
            ]
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void>
    {
        void await queryRunner.dropColumns('users', [
            'facebookAccountId',
            'googleAccountId',
            'appleAccountId'
        ]);
    }
}
