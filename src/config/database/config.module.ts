import { Module } from '@nestjs/common';
import configuration from './configuration';
import { DbConfigService } from './config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * Database configurations module
 *
 * @module
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  providers: [ConfigService, DbConfigService],
  exports: [ConfigService, DbConfigService],
})
export class DbConfigModule {}
