import { IsNotEmpty, MaxLength, IsAlphanumeric } from 'class-validator';

export class CreateAlbumDto {
  @IsNotEmpty()
  @MaxLength(20)
  @IsAlphanumeric()
  name: string;

  @IsNotEmpty()
  @MaxLength(200)
  description: string;

  @IsNotEmpty()
  isPrivate: string;

  image: Express.Multer.File;
}
