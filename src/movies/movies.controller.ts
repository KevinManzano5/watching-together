import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Request as request } from 'express';

import { MoviesService } from './movies.service';
import { AddMovieToUserListDto, CreateMovieDto, UpdateMovieDto } from './dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  findAll() {
    return this.moviesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.moviesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.moviesService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Post('add-to-user')
  addMovieToUserList(
    @Request() request: request,
    @Body() addMovieToUserListDto: AddMovieToUserListDto,
  ) {
    return this.moviesService.addMovieToUserList(
      request,
      addMovieToUserListDto,
    );
  }
}
