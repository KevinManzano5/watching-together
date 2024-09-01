import { IsArray } from 'class-validator';

export class AddMovieToUserListDto {
  @IsArray()
  moviesIds: string[];
}
