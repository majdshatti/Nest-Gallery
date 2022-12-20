import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateAlbumDto {
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsNotEmpty()
  isPrivate: string;

  image: Express.Multer.File;
}
