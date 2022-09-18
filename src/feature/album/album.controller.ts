import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ParseIntPipe,
  ValidationPipe,
  Put,
  Delete,Query
} from '@nestjs/common';

import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './album.entity';
import { FilterAlbumDto } from './dto/filter-album.dto';

@Controller('album')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Get()
  getAlbums(@Query(ValidationPipe) filterAlbumDto: FilterAlbumDto): Promise<Album[]> {
    return this.albumService.getAlbums(filterAlbumDto);
  }

  @Get('/:id')
  getAlbumById(@Param('id', ParseIntPipe) id: number): Promise<Album> {
    return this.albumService.getAlbumById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createAlbum(@Body() body: CreateAlbumDto): Promise<Album> {
    return this.albumService.createAlbum(body);
  }

  @Put('/:id')
  updateAlbum(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateAlbumDto,
  ): Promise<Album> {
    return this.albumService.updateAlbum(id, body);
  }

  @Delete('/:id')
  deleteAlbum(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.albumService.deleteAlbum(id);
  }
}
