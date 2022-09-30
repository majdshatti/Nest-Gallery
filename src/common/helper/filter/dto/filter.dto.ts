import { IsNotEmpty, IsOptional } from 'class-validator';

export class FilterDto {
  @IsOptional()
  @IsNotEmpty()
  limit: number;

  @IsOptional()
  @IsNotEmpty()
  sortBy: string;
}
