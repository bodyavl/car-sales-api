import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { GetUser } from 'src/auth/decorators';

@ApiTags('car')
@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(
    FilesInterceptor('images', 20, {
      storage: diskStorage({
        destination: './uploads/',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${file.originalname}`);
        },
      }),
    }),
  )
  create(
    @GetUser('id') userId: string,
    @Body() createCarDto: CreateCarDto,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    return this.carService.create(createCarDto, images, userId);
  }

  @Get()
  findAll() {
    return this.carService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carService.update(+id, updateCarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carService.remove(+id);
  }
}
