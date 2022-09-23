import { IsNotEmpty, IsOptional } from 'class-validator';

export class FilterAlbumDto {
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  search: string;

  @IsOptional()
  @IsNotEmpty()
  type: string;
}
