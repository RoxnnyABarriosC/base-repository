import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import * as process from 'process';
dotenv.config();

const env = process.env;
const seed = process.argv.includes('--SEED');

const config: PostgresConnectionOptions = {
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
    type: 'postgres',
    entities: [`${process.cwd()}/dist/modules/**/infrastructure/schemas/*.schema{.ts,.js}`],
    migrations: [
        `${process.cwd()}/dist/modules/**/infrastructure/${seed ? 'seeds' : 'migrations'}/*{.ts,.js}`
    ]
};

const dataSource = new DataSource(config);

export default dataSource;
