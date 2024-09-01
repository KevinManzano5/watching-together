import { Module } from '@nestjs/common';

import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService],
  imports: [AuthModule],
})
export class MoviesModule {}
