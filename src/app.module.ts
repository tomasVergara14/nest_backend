import { Module } from '@nestjs/common';
//External imports
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';

@Module({
  // eslint-disable-next-line prettier/prettier
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    // eslint-disable-next-line prettier/prettier
    
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
