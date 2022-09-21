import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';

@Module({
  imports: [AuthModule],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
