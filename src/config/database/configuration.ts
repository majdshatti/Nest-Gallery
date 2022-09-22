import { registerAs } from '@nestjs/config';

/**
 * Registering configurations in the name of database
 *
 * @function
 */
export default registerAs('database', () => ({
  type: process.env.DATABASE_TYPE,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT || 5432,
  name: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
}));
