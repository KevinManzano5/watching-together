import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [AuthModule, MoviesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
