import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from './album.entity';
import { AlbumRepositroy } from './album.repository';
import { CreateAlbumDto } from './dto/create-album.dto';
import { FilterAlbumDto } from './dto/filter-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumService {
  async getAlbums(filterAlbumDto: FilterAlbumDto): Promise<Album[]> {
    return await AlbumRepositroy.getAlbums(filterAlbumDto);
  }

  async getAlbumById(id: number): Promise<Album> {
    const album = await AlbumRepositroy.findOneBy({ id });

    if (!album) {
      throw new NotFoundException(`${id} does not exist.`);
    }

    return album;
  }

  async createAlbum(body: CreateAlbumDto): Promise<Album> {
    return AlbumRepositroy.createAlbum(body);
  }

  async updateAlbum(id: number, body: UpdateAlbumDto): Promise<Album> {
    const album = await this.getAlbumById(id);

    return AlbumRepositroy.updateAlbum(album, body);
  }

  async deleteAlbum(id: number): Promise<void> {
    const results = await AlbumRepositroy.delete({ id });

    if (results.affected === 0) {
      throw new NotFoundException(`${id} does not exist.`);
    }
  }
}
