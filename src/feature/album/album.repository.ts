// Entity
import { User } from '../user';
import { Album } from './album.entity';
// Data transfer objects
import { UpdateAlbumDto } from './dto/';
// Utilites
import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class AlbumRepository extends Repository<Album> {
  constructor(private dataSource: DataSource) {
    super(Album, dataSource.createEntityManager());
  }

  /**
   * Store an album
   *
   * @param body
   * @returns Album: Stored album
   */
  async createAlbum(album: Album): Promise<Album> {
    return await album.save();
  }

  /**
   * Update album's data
   *
   * @param album Album to be updated
   * @param body
   * @returns Updated album
   */
  async updateAlbum(album: Album, body: UpdateAlbumDto): Promise<Album> {
    return await album.save();
  }
}
