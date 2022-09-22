// Typeorm
import { DataSourceOptions } from 'typeorm';
// Environment variables (congigs)
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Datasource of database connection
 *
 * @constant
 */
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: process.env.NODE_ENV === 'production' ? false : true,
};
