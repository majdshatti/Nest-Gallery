import { Module, Logger } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { Album } from './album.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumRepository } from './album.repository';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Album])],
  controllers: [AlbumController],
  providers: [AlbumService, AlbumRepository],
})
export class AlbumModule {}
