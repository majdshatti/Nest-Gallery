import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ParseIntPipe,
  ValidationPipe,
  Patch,
} from '@nestjs/common';

import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumEntity } from './album.entity';

@Controller('album')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Get('/:id')
  getAlbumById(@Param('id', ParseIntPipe) id: number): Promise<AlbumEntity> {
    return this.albumService.getAlbumById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createAlbum(@Body() body: CreateAlbumDto): Promise<AlbumEntity> {
    return this.albumService.createAlbum(body);
  }

  @Patch('/:id')
  updateAlbum(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateAlbumDto,
  ): Promise<AlbumEntity> {
    return this.albumService.updateAlbum(id, body);
  }
}
