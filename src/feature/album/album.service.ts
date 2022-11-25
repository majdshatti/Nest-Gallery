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

  async getAlbumById(id: number, user: User): Promise<Album> {
    const album = await this.albumRepository.findOne({
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
    return this.albumRepository.createAlbum(createAlbumDto, user);
  }

  async updateAlbum(
    id: number,
    body: UpdateAlbumDto,
    user: User,
  ): Promise<Album> {
    const album = await this.getAlbumById(id, user);

    return this.albumRepository.updateAlbum(album, body);
  }

  async deleteAlbum(id: number, user: User): Promise<void> {
    const results = await this.albumRepository.delete({ id, userId: user.id });

    if (results.affected === 0) {
      throw new NotFoundException(`${id} does not exist.`);
    }
  }
}
