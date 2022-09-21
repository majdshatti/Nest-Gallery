import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlbumModule } from './feature/album/album.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './feature/auth/auth.module';
import { AppConfigModule } from './config/app/config.module';
import { DbConfigModule } from './config/database/config.module';
import { dataSourceOptions } from './database/dataSourceOptions';
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
