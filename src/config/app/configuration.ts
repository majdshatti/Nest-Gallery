import { registerAs } from '@nestjs/config';

/**
 * Registering configurations in the name of app
 *
 * @function
 */
export default registerAs('app', () => ({
  env: process.env.APP_ENV,
  port: parseInt(process.env.APP_PORT, 10) || 3000,
  name: process.env.APP_NAME,
  url: process.env.APP_URL,
}));
