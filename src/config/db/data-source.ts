import configuration from '@config/configuration';
import { RmProp } from '@shared/utils';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import * as process from 'process';
dotenv.config();

const seed = process.argv.includes('--SEED');

const dbConfig = { ...configuration().db };

RmProp(dbConfig, ['synchronize', 'autoLoadEntities', 'logging', 'migrationsRun', 'subscribers']);

const config: PostgresConnectionOptions = {
    ...dbConfig,
    entities: [`${process.cwd()}/dist/modules/**/infrastructure/schemas/*.schema{.ts,.js}`],
    migrations: [
        `${process.cwd()}/dist/modules/**/infrastructure/${seed ? 'seeds' : 'migrations'}/*{.ts,.js}`
    ]
};

const dataSource = new DataSource(config);

export default dataSource;
