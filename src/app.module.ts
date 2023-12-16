import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  // eslint-disable-next-line prettier/prettier
  imports: [
    AuthModule,
    MongooseModule.forRoot('mongodb://localhost:27017')
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
