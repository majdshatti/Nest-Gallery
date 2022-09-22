// Typeorm
import { DataSource } from 'typeorm';
// Datasource options
import { dataSourceOptions } from './dataSourceOptions';

// Initializing DataSource
export const AppDataSource = new DataSource(dataSourceOptions);

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
