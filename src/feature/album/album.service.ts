import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user';
// Entity
import { Album } from './album.entity';
// Repositoy
import { AlbumRepository } from './album.repository';
// Data Transfer Objects
import { CreateAlbumDto, FilterAlbumDto, UpdateAlbumDto } from './dto';

@Injectable()
export class AlbumService {
  async getAlbums(
    filterAlbumDto: FilterAlbumDto,
    user: User,
  ): Promise<Album[]> {
    return await AlbumRepository.getAlbums(filterAlbumDto, user);
  }

  async getAlbumById(id: number, user: User): Promise<Album> {
    const album = await AlbumRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!album) {
      throw new NotFoundException(`${id} does not exist.`);
    }

    return album;
  }

  async createAlbum(
    createAlbumDto: CreateAlbumDto,
    user: User,
  ): Promise<Album> {
    return AlbumRepository.createAlbum(createAlbumDto, user);
  }

  async updateAlbum(
    id: number,
    body: UpdateAlbumDto,
    user: User,
  ): Promise<Album> {
    const album = await this.getAlbumById(id, user);

    return AlbumRepository.updateAlbum(album, body);
  }

  async deleteAlbum(id: number, user: User): Promise<void> {
    const results = await AlbumRepository.delete({ id, userId: user.id });

    if (results.affected === 0) {
      throw new NotFoundException(`${id} does not exist.`);
    }
  }
}
