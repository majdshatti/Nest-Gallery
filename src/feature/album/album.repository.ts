// DataSource
import { AppDataSource } from 'src/database/dataSource';
// Entity
import { Album } from './album.entity';
// Data transfer objects
import { CreateAlbumDto, UpdateAlbumDto, FilterAlbumDto } from './dto/';

export const AlbumRepositroy = AppDataSource.manager
  .getRepository(Album)
  .extend({
    /**
     * Get albums with the ability of providing querys
     *
     * @param filterAlbumDto
     * @returns Album[]: Array of albums
     */
    async getAlbums(filterAlbumDto: FilterAlbumDto): Promise<Album[]> {
      const { name, search, isPrivate } = filterAlbumDto;

      // Init query builder
      const queryBuilder = this.createQueryBuilder('album');

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
    async createAlbum(body: CreateAlbumDto): Promise<Album> {
      const { name, description, isPrivate, image } = body;

      const album = new Album();
      album.name = name;
      album.description = description;
      album.isPrivate = isPrivate;
      album.image = image;

      return await album.save();
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
