// DataSource
import { AppDataSource } from 'src/database/dataSource';
// Entity
import { User } from '../user';
import { Album } from './album.entity';
// Data transfer objects
import { CreateAlbumDto, UpdateAlbumDto, FilterAlbumDto } from './dto/';
// Utilites
import { v4 as uuid } from 'uuid';

export const AlbumRepository = AppDataSource.manager
  .getRepository(Album)
  .extend({
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
    },

    /**
     * Store an album
     *
     * @param body
     * @returns Album: Stored album
     */
    async createAlbum(body: CreateAlbumDto, user: User): Promise<Album> {
      const { name, description, isPrivate, image } = body;

      const album = new Album();

      album._id = uuid();
      album.name = name;
      album.description = description;
      album.isPrivate = parseInt(isPrivate, 10) == 1 ? true : false;
      //! It will be changed in the feature to get images from AWS S3 service
      album.image =
        'https://fakepath/AWS/soon/S3/storage/' +
        new Date().toISOString() +
        '-' +
        image.originalname;
      album.user = user;

      await album.save();

      delete album.user;

      return album;
    },

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
    },
  });
