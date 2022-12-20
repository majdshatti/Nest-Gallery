import { IsNotEmpty, IsOptional } from 'class-validator';
import { QueryFilterDto } from 'src/feature/filter';

export class FilterAlbumDto extends QueryFilterDto {
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  description: string;
}
