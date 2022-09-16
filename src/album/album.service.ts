import { Injectable } from '@nestjs/common';
import { Album } from './album.model';
import { CreateAlbumDto } from './dto/create-album.dto';
import { v1 as uuid } from 'uuid';

@Injectable()
export class AlbumService {
  private albums: Album[] = [];

  getAllAlbums(): Album[] {
    return this.albums;
  }

  createAlbum(createAlbumDto: CreateAlbumDto): Album {
    const { name, description, isPrivate, image } = createAlbumDto;

    const album: Album = {
      id: uuid(),
      name,
      description,
      image,
      isPrivate,
    };

    this.albums.push(album);

    return album;
  }
}
