// Nest
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
  Put,
  Delete,
  UseInterceptors,
  UseGuards,
  UploadedFile,
} from '@nestjs/common';
// Guard
import { AuthGuard } from '@nestjs/passport';
// Services
import { AlbumService } from './album.service';
// Entity
import { Album } from './';
import { User } from '../user';
// Data Transfar Objects
import { CreateAlbumDto, UpdateAlbumDto, FilterAlbumDto } from './dto';
// Decorator & Pipes
import { GetUser } from 'src/common/decorators/get-user.decorators';
import { ImageOptimizerPipe } from 'src/common/pipes/image-optimizer.pipe';
// File Interceptor
import { FileInterceptor } from '@nestjs/platform-express';
// Filter
import { FilterDecorator, IFilterResult } from '../filter';

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
   * @returns list of albums
   */
  @Get()
  getAlbums(
    @FilterDecorator() query: FilterAlbumDto,
    @GetUser() user: User,
  ): Promise<IFilterResult> {
    return this.albumService.getAlbums(query, user);
  }

  /**
   * Get album by id
   *
   * @route GET /album/:id
   * @param id id from the url param
   * @returns album of a specified id
   */
  @Get('/:id')
  getAlbumByUuid(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Album> {
    return this.albumService.getUserAlbumByUuid(id, user);
  }

  /**
   * Create an album
   *
   * @route POST /album
   * @param body CreateAlbumDto
   * @param user User
   *
   * @returns created album
   */
  @Post()
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('image'))
  createAlbum(
    @Body() createAlbumDto: CreateAlbumDto,
    @GetUser() user: User,
    @UploadedFile(ImageOptimizerPipe) image: Express.Multer.File,
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
   * @returns updated album
   */
  @Put('/:id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('image'))
  updateAlbum(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
    @GetUser() user: User,
    @UploadedFile(ImageOptimizerPipe) image: Express.Multer.File,
  ): Promise<Album> {
    updateAlbumDto.image = image;
    return this.albumService.updateAlbum(id, updateAlbumDto, user);
  }

  /**
   * Delete an album
   *
   * @route DELETE /album/:id
   * @param id id from the url param
   * @returns void
   */
  @Delete('/:id')
  deleteAlbum(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<{message: string}> {
    return this.albumService.deleteAlbum(id, user);
  }
}
