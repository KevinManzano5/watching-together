import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Request } from 'express';

import { AddMovieToUserListDto, CreateMovieDto, UpdateMovieDto } from './dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class MoviesService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('MoviesService');

  constructor(private readonly authService: AuthService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async create(createMovieDto: CreateMovieDto) {
    try {
      return await this.movie.create({ data: createMovieDto });
    } catch ({ message, code }) {
      if (code === 'P2002') {
        throw new BadRequestException({
          message: `Check field constraints`,
        });
      }

      this.logger.error(message);

      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    return await this.movie.findMany();
  }

  async findOne(id: string) {
    const movie = await this.movie.findUnique({ where: { id } });

    if (!movie || !movie.isActive) {
      throw new NotFoundException({
        message: `Movie with id ${id} not found`,
      });
    }

    return movie;
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    await this.findOne(id);

    const updatedMovie = await this.movie.update({
      data: updateMovieDto,
      where: { id },
    });

    return updatedMovie;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.movie.update({ where: { id }, data: { isActive: false } });
  }

  async addMovieToUserList(
    request: Request,
    { moviesIds }: AddMovieToUserListDto,
  ) {
    const userId = request['user'].sub;

    await this.authService.getUser(userId);

    for (const movieId of moviesIds) {
      await this.findOne(movieId);
    }

    const newUserMovies = moviesIds.map((movieId) => ({
      userId,
      movieId,
    }));

    await this.userMovie.createMany({ data: newUserMovies });
  }
}
