import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { ImageModule } from 'src/image/image.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Car]), ImageModule, UserModule],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
