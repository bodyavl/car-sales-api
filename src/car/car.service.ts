import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { ImageService } from 'src/image/image.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { Repository } from 'typeorm';
import { Image } from 'src/image/entities/image.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car) private carRepository: Repository<Car>,
    private imageService: ImageService,
    private userService: UserService,
  ) {}

  async create(
    createCarDto: CreateCarDto,
    images: Array<Express.Multer.File>,
    userId: string,
  ): Promise<Car> {
    const author = await this.userService.findOneBy({ id: userId });

    if (!author) throw new NotFoundException('User not found');

    const car = await this.carRepository.save(
      this.carRepository.create({ ...createCarDto, author }),
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
      .select(
        'c.id, c.authorId, c.carManufacturer, c.carModel, c.year, c.publishDate, c.description',
      )
      .addSelect((subQuery) => {
        return subQuery
          .select('i.id', 'imageId')
          .from(Image, 'i')
          .where('i.carId = c.id')
          .limit(1);
      }, 'imageId')
      .orderBy('c.id')
      .getRawMany();

    return cars;
  }

  async findOne(id: string): Promise<Car> {
    const car = await this.carRepository
      .createQueryBuilder('c')
      .select(['c', 'i.id'])
      .leftJoin('c.images', 'i', 'i.carId = c.id')
      .leftJoinAndSelect('c.author', 'user', 'user.id = c.authorId')
      .where('c.id = :id', { id })
      .getOne();

    if (!car) throw new NotFoundException('Car not found');

    return car;
  }

  async update(id: string, updateCarDto: UpdateCarDto, userId: string) {
    const car = await this.carRepository.findOneBy({
      id,
      author: { id: userId },
    });

    if (!car) throw new NotFoundException('Car not found');

    return this.carRepository.save({ ...car, ...updateCarDto });
  }

  async remove(id: string, userId: string) {
    const car = await this.carRepository.findOneBy({
      id,
      author: { id: userId },
    });

    if (!car) throw new NotFoundException('Car not found');

    await this.carRepository.delete(id);

    return { message: 'Car deleted' };
  }
}
