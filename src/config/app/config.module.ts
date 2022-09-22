// Nest
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
// Service
import { AppConfigService } from './config.service';
// Configs
import configuration from './configuration';

/**
 * Application configurations module
 *
 * @module
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})
export class AppConfigModule {}
