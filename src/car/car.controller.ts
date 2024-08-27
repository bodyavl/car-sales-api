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
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AccessTokenGuard, OptionalAccessTokenGuard } from 'src/auth/guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { GetUser } from 'src/auth/decorators';
import {
  CarResponseInterceptor,
  ShortenFieldInEveryObjectInArrayInterceptor,
} from 'src/core/interceptors';
import { generateFileName } from 'src/utils/multer/generateFileName';
import { Car } from './entities/car.entity';

@ApiTags('Car')
@Controller({
  path: 'car',
  version: '1',
})
export class CarController {
  constructor(private readonly carService: CarService) {}

  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ description: 'Car created successfully', type: Car })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth('access_token')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(
    FilesInterceptor('images', 20, {
      storage: diskStorage({
        destination: './uploads/',
        filename: generateFileName,
      }),
    }),
  )
  @Post()
  create(
    @GetUser('id') userId: string,
    @Body() createCarDto: CreateCarDto,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    return this.carService.create(createCarDto, images, userId);
  }

  @ApiOkResponse({
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'stirng' },
          authorId: { type: 'stirng' },
          carManufacturer: { type: 'string' },
          carModel: { type: 'string' },
          year: { type: 'number' },
          publishDate: { type: 'string' },
          description: { type: 'string' },
          imageId: { type: 'stirng' },
        },
      },
    },
    description: 'Cars found',
  })
  @UseInterceptors(
    new ShortenFieldInEveryObjectInArrayInterceptor('description'),
  )
  @Get()
  findAll() {
    return this.carService.findAll();
  }

  @ApiBearerAuth('access_token')
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        authorId: { type: 'stirng' },
        carManufacturer: { type: 'string' },
        carModel: { type: 'string' },
        year: { type: 'number' },
        publishDate: { type: 'string' },
        description: { type: 'string' },
        VIN: { type: 'string' },
        images: {
          type: 'array',
          items: { type: 'object', properties: { id: { type: 'string' } } },
        },
      },
    },
    description: 'Car found',
  })
  @ApiNotFoundResponse({ description: 'Car not found' })
  @UseInterceptors(CarResponseInterceptor)
  @UseGuards(OptionalAccessTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carService.findOne(id);
  }

  @ApiBearerAuth('access_token')
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Car updated successfully' })
  @ApiNotFoundResponse({ description: 'Car not found' })
  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCarDto: UpdateCarDto,
    @GetUser('id') userId: string,
  ) {
    return this.carService.update(id, updateCarDto, userId);
  }

  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Car deleted successfully' })
  @ApiNotFoundResponse({ description: 'Car not found' })
  @ApiBearerAuth('access_token')
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.carService.remove(id, userId);
  }
}
