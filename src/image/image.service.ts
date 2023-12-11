import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Image } from './entities/image.entity';
import { DeleteResult, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from 'src/car/entities/car.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image) private imageRepository: Repository<Image>,
  ) {}

  async create(file: Express.Multer.File, car: Car) {
    if (!file) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            file: 'selectFile',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const path = file.path.replace('uploads', '');

    const image = this.imageRepository.create({ path, car });

    return this.imageRepository.save(image);
  }

  async findOne(id: string): Promise<Image> {
    const image = await this.imageRepository.findOne({ where: { id } });

    if (!image) throw new NotFoundException('Image not found');

    return image;
  }

  async delete(options: FindOptionsWhere<Image>): Promise<DeleteResult> {
    return this.imageRepository.delete(options);
  }
}
