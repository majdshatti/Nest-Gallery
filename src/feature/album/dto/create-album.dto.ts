import { IsNotEmpty } from "class-validator";

export class CreateAlbumDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  isPrivate: boolean;
  
  @IsNotEmpty()
  image: string;
}
