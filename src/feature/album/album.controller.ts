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
  UseInterceptors,
  UseGuards,
  UploadedFile,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
// Services
import { AlbumService } from './album.service';
// Entity
import { Album } from './album.entity';
import { User } from '../user';
// Data Transfar Objects
import { CreateAlbumDto, UpdateAlbumDto, FilterAlbumDto } from './dto';
// Decorator
import { GetUser } from 'src/common/decorators/get-user.decorators';
// File Interceptor
import { FileInterceptor } from '@nestjs/platform-express';
//
import {
  FilterOperator,
  Paginate,
  PaginateQuery,
  paginate,
  Paginated,
} from 'nestjs-paginate';

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
  getAlbums(@Paginate() query: FilterAlbumDto, @GetUser() user: User) {
    return this.albumService.getAlbums(query, user);
  }

  /**
   * Get album by id
   *
   * @route GET /album/:id
   * @param id id from the url param
   * @returns //TODO
   */
  @Get('/:id')
  getAlbumById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Album> {
    return this.albumService.getAlbumById(id, user);
  }

  /**
   * Create an album
   *
   * @route POST /album
   * @param body CreateAlbumDto
   * @param user User
   * @returns //TODO
   */
  @Post()
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('image'))
  createAlbum(
    @Body() createAlbumDto: CreateAlbumDto,
    @GetUser() user: User,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Album> {
    createAlbumDto.image = image;
    return this.albumService.createAlbum(createAlbumDto, user);
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
    @GetUser() user: User,
  ): Promise<Album> {
    return this.albumService.updateAlbum(id, body, user);
  }

  /**
   * Delete an album
   *
   * @route DELETE /album/:id
   * @param id id from the url param
   * @returns //TODO
   */
  @Delete('/:id')
  deleteAlbum(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.albumService.deleteAlbum(id, user);
  }
}
