import { IsNotEmpty, IsOptional } from 'class-validator';
import { FilterDto } from 'src/common/helper/filter';

export class FilterAlbumDto extends FilterDto {
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
