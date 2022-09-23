// Nest
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// DataSoruce
import { dataSourceOptions } from './database/dataSourceOptions';
// Configs
import { AppConfigModule } from './config/app/config.module';
import { DbConfigModule } from './config/database/config.module';
// Feature modules
import { AlbumModule } from './feature/album/album.module';
import { AuthModule } from './feature/auth/auth.module';
import { UserModule } from './feature/user/user.module';

@Module({
  imports: [
    AppConfigModule,
    DbConfigModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    AlbumModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
