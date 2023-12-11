import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import authConfig from './config/auth.config';
import databaseConfig from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './db/data-source';
import { CarModule } from './car/car.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [authConfig, databaseConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    CarModule,
    ImageModule,
  ],
})
export class AppModule {}
