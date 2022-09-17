import { Album } from './album.entity';
import { AppDataSource } from 'src/app-data-source';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

export const AlbumRepositroy = AppDataSource.manager
  .getRepository(Album)
  .extend({
    async createAlbum(body: CreateAlbumDto): Promise<Album> {
      const { name, description, isPrivate, image } = body;

      const album = new Album();
      album.name = name;
      album.description = description;
      album.isPrivate = isPrivate;
      album.image = image;

      await album.save();
      return album;
    },

    async updateAlbum(
      album: Album,
      body: UpdateAlbumDto,
    ): Promise<Album> {
      const { name, description, isPrivate, image } = body;
      album.name = name ?? album.name;
      album.description = description ?? album.description;
      album.isPrivate = isPrivate ?? album.isPrivate;
      album.image = image ?? album.image;

      await album.save();
      return album;
    },
  });
