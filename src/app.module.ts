// Nest
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// DataSoruce
import { dataSourceOptions } from './database/dataSourceOptions';
// Configs
import { AppConfigModule } from './config/app/config.module';
import { DbConfigModule } from './config/database/config.module';
// Multer
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
// Feature modules
import { AlbumModule } from './feature/album';
import { AuthModule } from './feature/auth/auth.module';
import { UserModule } from './feature/user/user.module';
import { HttpLoggerMiddleware } from './common/middlewares';

@Module({
  imports: [
    AppConfigModule,
    DbConfigModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    MulterModule.register({
      storage: memoryStorage(),
    }),
    AlbumModule,
    AuthModule,
    UserModule,
  ],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
