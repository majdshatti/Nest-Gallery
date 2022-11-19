// Typeorm
import { DataSource } from 'typeorm';
// Datasource options
import { dataSourceOptions } from './dataSourceOptions';
// Logger
import { Logger } from '@nestjs/common';
const logger = new Logger('Data App Source');

// Initializing DataSource
export const AppDataSource = new DataSource(dataSourceOptions);

AppDataSource.initialize()
  .then(() => {
    logger.log('Data Source has been initialized!');
  })
  .catch((err) => {
    logger.error('Error during Data Source initialization', err);
  });
