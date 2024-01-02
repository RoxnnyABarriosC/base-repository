import { basicPropertiesMigration } from '@config/db';
import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, TableIndex } from 'typeorm';

export class CreateUsersTable1691331857829 implements MigrationInterface
{
    private readonly logger = new Logger(CreateUsersTable1691331857829.name);

    public async up(queryRunner: QueryRunner): Promise<void>
    {
        void await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    ...basicPropertiesMigration,
                    new TableColumn({
                        name: 'userName',
                        type: 'varchar',
                        default: '\'user\''
                    }),
                    new TableColumn({
                        name: 'firstName',
                        type: 'varchar'
                    }),
                    new TableColumn({
                        name: 'lastName',
                        type: 'varchar'
                    }),
                    new TableColumn({
                        name: 'email',
                        type: 'varchar',
                        isNullable: true
                    }),
                    new TableColumn({
                        name: 'phone',
                        type: 'varchar',
                        isUnique: true
                    }),
                    new TableColumn({
                        name: 'gender',
                        type: 'varchar'
                    }),
                    new TableColumn({
                        name: 'birthday',
                        type: 'timestamp'
                    }),
                    new TableColumn({
                        name: 'verify',
                        type: 'boolean',
                        default: false
                    }),
                    new TableColumn({
                        name: 'onBoarding',
                        type: 'boolean',
                        default: true
                    }),
                    new TableColumn({
                        name: 'password',
                        type: 'varchar'
                    }),
                    new TableColumn({
                        name: 'passwordRequestedAt',
                        type: 'timestamp',
                        isNullable: true
                    }),
                    new TableColumn({
                        name: 'enable',
                        type: 'boolean',
                        default: false
                    }),
                    new TableColumn({
                        name: 'isSuperAdmin',
                        type: 'boolean',
                        default: false
                    }),
                    new TableColumn({
                        name: 'permissions',
                        type: 'text',
                        isNullable: true
                    }),
                    new TableColumn({
                        name: 'mainPicture_id',
                        type: 'uuid',
                        isNullable: true
                    }),
                    new TableColumn({
                        name: 'banner_id',
                        type: 'uuid',
                        isNullable: true
                    })
                ],
                foreignKeys: [
                    new TableForeignKey({
                        columnNames: ['mainPicture_id'],
                        referencedColumnNames: ['_id'],
                        referencedTableName: 'files',
                        onDelete: 'CASCADE'
                    }),
                    new TableForeignKey({
                        columnNames: ['banner_id'],
                        referencedColumnNames: ['_id'],
                        referencedTableName: 'files',
                        onDelete: 'CASCADE'
                    })
                ]
            })
        );

        void await queryRunner.createTable(
            new Table({
                name: 'users_has_roles',
                columns: [
                    new TableColumn({
                        name: 'user_id',
                        type: 'uuid'
                    }),
                    new TableColumn({
                        name: 'role_id',
                        type: 'uuid'
                    })
                ],
                indices: [
                    new TableIndex({
                        name: 'IDX_USER_ROLE',
                        isUnique: true,
                        columnNames: ['user_id', 'role_id']
                    })
                ],
                foreignKeys: [
                    new TableForeignKey({
                        columnNames: ['user_id'],
                        referencedColumnNames: ['_id'],
                        referencedTableName: 'users'
                    }),
                    new TableForeignKey({
                        columnNames: ['role_id'],
                        referencedColumnNames: ['_id'],
                        referencedTableName: 'roles'
                    })
                ]
            })
        );

        void await queryRunner.createPrimaryKey(
            'users_has_roles', ['user_id', 'role_id']
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void>
    {
        void await queryRunner.dropTable('users_has_roles');
        void await queryRunner.dropTable('users');
    }
}
