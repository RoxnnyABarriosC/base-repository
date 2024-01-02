import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, TableCheck, TableColumn } from 'typeorm';

export class SetNullGenderAndBirthdayColumns1701453043367 implements MigrationInterface
{
    private readonly logger = new Logger(SetNullGenderAndBirthdayColumns1701453043367.name);

    public async up(queryRunner: QueryRunner): Promise<void>
    {
        void await queryRunner.changeColumn('users',
            new TableColumn({
                name: 'gender',
                type: 'varchar'
            }),
            new TableColumn({
                name: 'gender',
                type: 'varchar',
                isNullable: true
            })
        );

        void await queryRunner.changeColumn('users',
            new TableColumn({
                name: 'birthday',
                type: 'timestamp'
            }),
            new TableColumn({
                name: 'birthday',
                type: 'timestamp',
                isNullable: true
            })
        );

        void await queryRunner.createCheckConstraint('users', new TableCheck({
            name: 'ON_BOARDING_CHECK',
            columnNames: ['onBoarding', 'phone', 'gender', 'birthday'],
            expression: `
              ("onBoarding" = true) OR
              ("onBoarding" = false AND phone IS NOT NULL AND gender IS NOT NULL AND birthday IS NOT NULL)
            `
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void>
    {
        void await queryRunner.changeColumn('users',
            new TableColumn({
                name: 'gender',
                type: 'varchar',
                isNullable: true
            }),
            new TableColumn({
                name: 'gender',
                type: 'varchar',
                isNullable: false
            })
        );

        void await queryRunner.changeColumn('users',
            new TableColumn({
                name: 'birthday',
                type: 'timestamp',
                isNullable: true
            }),
            new TableColumn({
                name: 'birthday',
                type: 'timestamp',
                isNullable: false
            })
        );
    }
}
