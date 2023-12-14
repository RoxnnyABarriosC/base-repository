import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, TableColumn, TableIndex } from 'typeorm';

export class AddUserNameIdColumn1702403862121 implements MigrationInterface
{
    private readonly logger = new Logger(AddUserNameIdColumn1702403862121.name);

    public async up(queryRunner: QueryRunner): Promise<void>
    {
        void await queryRunner.addColumn('users',  new TableColumn({
            name: 'userNameId',
            type: 'int',
            isGenerated: true,
            generationStrategy: 'increment'
        }));

        void await queryRunner.createIndices('users', [
            new TableIndex({
                name: 'IDX_USER_NAME',
                isUnique: true,
                columnNames: ['userName', 'userNameId']
            })
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void>
    {
        void await queryRunner.dropColumn('users', 'userNameId');
        void await queryRunner.dropPrimaryKey('users', 'PK_USER_NAME_ID');
        void await queryRunner.dropIndex('users', 'IDX_USER_NAME');
    }
}
