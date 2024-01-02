import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserToDeleteView1704211656642 implements MigrationInterface
{
    private readonly logger = new Logger(CreateUserToDeleteView1704211656642.name);

    public async up(queryRunner: QueryRunner): Promise<void>
    {
        await queryRunner.query(
            `CREATE VIEW user_to_delete_view AS SELECT i._id, 
                       i.email, 
                       LOWER(SPLIT_PART(i.email, '@', 2)) as "domain", 
                       EXTRACT(DAY FROM (CURRENT_DATE - i."deletedAt"))::integer days 
                FROM "users" as i
                WHERE "deletedAt" IS NOT NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void>
    {
        await queryRunner.query('DROP VIEW user_to_delete_view');
    }
}
