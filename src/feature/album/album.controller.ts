// Nest
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
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// Services
import { AlbumService } from './album.service';
// Entity
import { Album } from './album.entity';
// Data Transfar Objects
import { CreateAlbumDto, UpdateAlbumDto, FilterAlbumDto } from './dto';

/**
 * Album Controller
 *
 * @class
 */
@Controller('album')
@UseGuards(AuthGuard())
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  /**
   * Get albums with query filters
   *
   * @route GET /album
   * @param filterAlbumDto FilterAlbumDto
   * @returns //TODO
   */
  @Get()
  getAlbums(
    @Query(ValidationPipe) filterAlbumDto: FilterAlbumDto,
  ): Promise<Album[]> {
    return this.albumService.getAlbums(filterAlbumDto);
  }

  /**
   * Get album by id
   *
   * @route GET /album/:id
   * @param id id from the url param
   * @returns //TODO
   */
  @Get('/:id')
  getAlbumById(@Param('id', ParseIntPipe) id: number): Promise<Album> {
    return this.albumService.getAlbumById(id);
  }

  /**
   * Create an album
   *
   * @route POST /album
   * @param body CreateAlbumDto
   * @returns //TODO
   */
  @Post()
  @UsePipes(ValidationPipe)
  createAlbum(@Body() body: CreateAlbumDto): Promise<Album> {
    return this.albumService.createAlbum(body);
  }

  /**
   * Update an album
   *
   * @route PUT /album/:id
   * @param id id from the url param
   * @param updateAlbumDto UpdateAlbumDto
   * @returns //TODO
   */
  @Put('/:id')
  updateAlbum(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateAlbumDto,
  ): Promise<Album> {
    return this.albumService.updateAlbum(id, body);
  }

  /**
   * Delete an album
   *
   * @route DELETE /album/:id
   * @param id id from the url param
   * @returns //TODO
   */
  @Delete('/:id')
  deleteAlbum(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.albumService.deleteAlbum(id);
  }
}
