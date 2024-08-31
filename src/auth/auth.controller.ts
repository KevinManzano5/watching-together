import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request as request } from 'express';

import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto, UpdateUserDto } from './dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  profile(@Request() request: request) {
    return this.authService.profile(request);
  }

  @UseGuards(AuthGuard)
  @Patch()
  updateUser(
    @Request() request: request,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.authService.updateUser(request, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete()
  @HttpCode(HttpStatus.ACCEPTED)
  deleteUser(@Request() request: request) {
    return this.authService.deleteUser(request);
  }
}
