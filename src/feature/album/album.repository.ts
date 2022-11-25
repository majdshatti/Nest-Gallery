// Entity
import { User } from '../user';
import { Album } from './album.entity';
// Data transfer objects
import { CreateAlbumDto, UpdateAlbumDto, FilterAlbumDto } from './dto/';
// Utilites
import { v4 as uuid } from 'uuid';
import { S3Service } from 'src/common/services/aws/s3/s3.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class AlbumRepository extends Repository<Album> {
  constructor(private dataSource: DataSource) {
    super(Album, dataSource.createEntityManager());
  }
  /**
   * Get albums with the ability of providing querys
   *
   * @param filterAlbumDto
   * @returns Album[]: Array of albums
   */
  async getAlbums(
    filterAlbumDto: FilterAlbumDto,
    user: User,
  ): Promise<Album[]> {
    const { name, search, type } = filterAlbumDto;

    // Init query builder
    const queryBuilder = this.createQueryBuilder('album');

    // Get all public albums except user's album
    if (type === 'public') {
      queryBuilder.andWhere(
        `album.isPrivate = :isPrivate AND album.userId != :userId`,
        { isPrivate: 0, userId: user.id },
      );
    }
    // Or get user's albums
    else if (!type || type === 'user') {
      queryBuilder.andWhere(`album.userId = :userId`, { userId: user.id });
    }

    // Check if name or description is passed as a query
    if (name)
      queryBuilder.andWhere(`album.name LIKE :name`, { name: `%${name}%` });

    if (search)
      queryBuilder.andWhere(
        `album.name LIKE :search OR album.description LIKE :search`,
        { search: `%${search}%` },
      );

    // Return all filtered albums
    return queryBuilder.getMany();
  }

  /**
   * Store an album
   *
   * @param body
   * @returns Album: Stored album
   */
  async createAlbum(body: CreateAlbumDto, user: User): Promise<Album> {
    const { name, description, isPrivate, image } = body;
    const s3Service = new S3Service();
    const album = new Album();

    album._id = uuid();
    album.name = name;
    album.description = description;
    album.isPrivate = parseInt(isPrivate, 10) == 1 ? true : false;
    album.user = user;

    try {
      const uploadedFile = await s3Service.uploadFile(
        image,
        `users/${user.username}`,
      );
      album.image = uploadedFile.Location;
    } catch (e) {
      throw new InternalServerErrorException(
        e.message,
        'Internal Server Error',
      );
    }

    await album.save();

    delete album.user;

    return album;
  }

  /**
   * Update album's data
   *
   * @param album Album to be updated
   * @param body
   * @returns Updated album
   */
  async updateAlbum(album: Album, body: UpdateAlbumDto): Promise<Album> {
    const { name, description, isPrivate, image } = body;
    album.name = name ?? album.name;
    album.description = description ?? album.description;
    album.isPrivate = isPrivate ?? album.isPrivate;
    album.image = image ?? album.image;

    return await album.save();
  }
}
