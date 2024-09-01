import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { isUUID } from 'class-validator';

import { LoginUserDto, RegisterUserDto, UpdateUserDto } from './dto';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async registerUser({ email, password, ...restDto }: RegisterUserDto) {
    if (await this.user.findUnique({ where: { email } })) {
      throw new BadRequestException({
        message: 'User already exists, please use another or login',
      });
    }

    const newUser = await this.user.create({
      data: { email, password: await bcrypt.hash(password, 10), ...restDto },
    });

    delete newUser.password;

    const payload = {
      sub: newUser.id,
      email: newUser.email,
    };

    return { user: newUser, token: await this.signNewToken(payload) };
  }

  async loginUser({ email, password }: LoginUserDto) {
    const user = await this.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException({
        message: `Email or password invalid`,
      });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException({
        message: `Email or password invalid`,
      });
    }

    delete user.password;

    const payload = {
      sub: user.id,
      email: user.email,
    };

    return { user, token: await this.signNewToken(payload) };
  }

  async getUser(param: string) {
    let user: User;

    if (isUUID(param)) {
      user = await this.user.findFirst({ where: { id: param } });
    } else {
      user = await this.user.findUnique({ where: { email: param } });
    }

    if (!user || !user.isActive) {
      throw new NotFoundException({
        message: 'User not found',
      });
    }

    delete user.password;

    const movies = await this.userMovie.findMany({
      where: { userId: user.id },
    });

    return {
      ...user,
      movies: movies.map((movie) => movie.id),
    };
  }

  async profile(request: Request) {
    const id = request['user'].sub;

    const user = await this.getUser(id);

    delete user.password;

    return user;
  }

  async updateUser(request: Request, updateUserDto: UpdateUserDto) {
    const id = request['user'].sub;

    await this.getUser(id);

    const updatedUser = await this.user.update({
      data: { ...updateUserDto },
      where: { id },
    });

    delete updatedUser.password;

    const payload = {
      sub: id,
      email: updatedUser.email,
    };

    return { user: updatedUser, token: await this.signNewToken(payload) };
  }

  async deleteUser(request: Request) {
    const id = request['user'].sub;

    await this.getUser(id);

    await this.user.update({ where: { id }, data: { isActive: false } });
  }

  async signNewToken(payload: any): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }
}
