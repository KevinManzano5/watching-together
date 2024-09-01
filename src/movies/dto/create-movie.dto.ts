import { IsString, MinLength } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @MinLength(1)
  name: string;
}
