import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { ImageService } from 'src/image/image.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { Repository } from 'typeorm';
import { Image } from 'src/image/entities/image.entity';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car) private carRepository: Repository<Car>,
    private imageService: ImageService,
  ) {}

  async create(
    createCarDto: CreateCarDto,
    images: Array<Express.Multer.File>,
    userId: string,
  ): Promise<Car> {
    const car = await this.carRepository.save(
      this.carRepository.create({ ...createCarDto }),
    );

    if (!images) return car;
    for (const image of images) {
      this.imageService.create(image, car);
    }

    return car;
  }

  async findAll(): Promise<Car[]> {
    const cars = await this.carRepository
      .createQueryBuilder('c')
      .select('c.*')
      .addSelect((subQuery) => {
        return subQuery
          .select('i.id', 'imageId')
          .from(Image, 'i')
          .where('i.carId = c.id')
          .limit(1);
      }, 'imageId')
      .orderBy('c.id')
      .getRawMany();

    console.log(cars);

    return cars;
  }

  async findOne(id: string): Promise<Car> {
    const car = await this.carRepository
      .createQueryBuilder('c')
      .select(['c', 'i.id'])
      .leftJoin('c.images', 'i', 'i.carId = c.id')
      .where('c.id = :id', { id })
      .getOne();

    if (!car) throw new NotFoundException('Car not found');
    return car;
  }

  update(id: number, updateCarDto: UpdateCarDto) {
    return `This action updates a #${id} car`;
  }

  remove(id: number) {
    return `This action removes a #${id} car`;
  }
}
