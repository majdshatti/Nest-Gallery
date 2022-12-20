// Nest
import { Injectable, NotFoundException } from '@nestjs/common';
// Entity
import { User } from '../user';
import { Album } from './album.entity';
// Repositoy
import { AlbumRepository } from './album.repository';
// Data Transfer Objects
import { CreateAlbumDto, FilterAlbumDto, UpdateAlbumDto } from './dto';
// Filter
import { filter, FilterOperator, IFilterResult } from 'src/feature/filter';

// Utilites
import { v4 as uuid } from 'uuid';
import { S3Service } from 'src/common/services/aws/s3/s3.service';

@Injectable()
export class AlbumService {
  constructor(private albumRepository: AlbumRepository) {}

  /**
   * Retures a list of non/filtered albums
   *
   * @param query FilterAlbumDto
   * @param user logged in user
   *
   * @returns list of albums
   */
  async getAlbums(query: FilterAlbumDto, user: User): Promise<IFilterResult> {
    return filter<Album>(query, this.albumRepository, {
      withRelations: ['user'],
      sortableColumns: ['name', 'createdAt', 'user.username'],
      searchableColumns: ['name', 'description', 'user.username'],
      defaultSortBy: [['createdAt', 'DESC']],
      filterableColumns: {
        name: [FilterOperator.LIKE, FilterOperator.EQ],
        'user.username': [FilterOperator.LIKE, FilterOperator.EQ],
      },
      conditions: {
        userId: user.id,
      },
      selectFields: [
        'album.id',
        'album._id',
        'album.name',
        'album.isPrivate',
        'album.createdAt',
        'album.updatedAt',
        'album.image',
        'user.id',
        'user._id',
        'user.username',
      ],
      paginate: {
        limit: 10,
      },
    });
  }

  /**
   * Gets a single album by id
   *
   * @param id uuid
   * @param user logged in user
   *
   * @returns album
   */
  async getUserAlbumByUuid(id: string, user: User): Promise<Album> {
    const album = await this.albumRepository.findOne({
      where: { _id: id, userId: user.id },
    });

    if (!album) throw new NotFoundException(`${id} does not exist.`);

    return album;
  }

  /**
   * Stores an album and uploads its image to the aws bucket
   *
   * @param createAlbumDto CreateAlbumDto
   * @param user logged in user
   *
   * @returns album
   */
  async createAlbum(
    createAlbumDto: CreateAlbumDto,
    user: User,
  ): Promise<Album> {
    const s3Service = new S3Service();
    const s3ObjectPath = `users/${user.username}/album`;

    const { name, description, isPrivate, image } = createAlbumDto;
    const album = new Album();

    album._id = uuid();
    album.name = name;
    album.description = description;
    album.isPrivate = parseInt(isPrivate, 10) == 1 ? true : false;
    album.userId = user.id;
    album.image = (await s3Service.uploadFile(image, s3ObjectPath)).Location;

    this.albumRepository.createAlbum(album);

    return album;
  }

  /**
   * Updates an album
   *
   * @param id uuid
   * @param updateAlbum UpdateAlbumDto
   * @param user logged in user
   *
   * @returns album
   */
  async updateAlbum(
    id: string,
    updateAlbumDto: UpdateAlbumDto,
    user: User,
  ): Promise<Album> {
    const s3Service = new S3Service();
    const s3ObjectPath = `users/${user.username}/album`;
    
    const { name, description, isPrivate, image } = updateAlbumDto;
    const album = await this.getUserAlbumByUuid(id, user);
    
    const imageName = album.image.split('/').pop();
    const path = s3ObjectPath + '/' + imageName;

    album.name = name ?? album.name;
    album.description = description ?? album.description;
    album.isPrivate = (parseInt(isPrivate, 10) == 1 ? true : false) ?? album.isPrivate;

    // Update image if exist in the request
    if(image)
      await s3Service.uploadFile(image, path, 'update');

    return this.albumRepository.updateAlbum(album, updateAlbumDto);
  }

  /**
   * Deletes an album
   *
   * @param id uuid
   * @param user logged in user
   *
   * @returns album
   */
  async deleteAlbum(id: string, user: User): Promise<{message: string}> {
    const s3Service = new S3Service();
    const s3ObjectPath = `users/${user.username}/album`;

    const album = await this.getUserAlbumByUuid(id, user);
  
    const results = await this.albumRepository.delete({ _id: id, userId: user.id });

    if (results.affected === 0) {
      throw new NotFoundException(`${id} does not exist.`);
    }

    const imageName = album.image.split('/').pop();
    const path = s3ObjectPath + '/' + imageName;
    
    s3Service.deleteFile(path);

    return {
      message: `${album.name} is deleted successfully`
    }
  }
}
