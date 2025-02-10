import { config } from 'dotenv';
import { DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
config();

const isProduction = process.env.NODE_ENV === 'production';
const isStaging = process.env.NODE_ENV === 'staging';
//local connection credentials

let entitiesPath = 'src/entities/**.entity.ts';
let migrationsPath = 'src/database/migrations/*.ts';

if (process.env.TENANT_DATABASE) {
  migrationsPath = 'src/database/tenant-migrations/*.ts';
  entitiesPath = 'src/tenant/entities/**.entity.ts';
}

const databaseName = process.env.TENANT_DATABASE ?? process.env.DB_DATABASE;

const dataSourceOptions: DataSourceOptions & SeederOptions = {
  migrationsTableName: 'migrations',
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password',
  database: databaseName,
  extra: {
    connectionLimit: 10, // Maximum number of connections in pool
    queueLimit: 0, // No limit on how many requests can queue
  },
  poolSize: 10,
  logging: false,
  synchronize: false,
  name: 'default',
  entities: [entitiesPath],
  migrations: [migrationsPath],
  seeds: ['src/database/seeds/**/*.ts'],
  ssl:
    isProduction || isStaging
      ? {
          rejectUnauthorized: false, // or true if you have a CA certificate
        }
      : false, // No SSL for local development
};

export { dataSourceOptions };
