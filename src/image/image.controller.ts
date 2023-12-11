import { Controller, Get, Param, Res } from '@nestjs/common';
import { ImageService } from './image.service';
import { Response } from 'express';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const file = await this.imageService.findOne(id);
    return res.sendFile(file.path, { root: 'uploads' });
  }
}
