import { Controller, Get, Param, Res } from '@nestjs/common';
import { ImageService } from './image.service';
import { Response } from 'express';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Image')
@Controller({
  path: 'image',
  version: '1',
})
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiOkResponse({ description: 'Image found' })
  @ApiNotFoundResponse({ description: 'Image not found' })
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const file = await this.imageService.findOne(id);
    return res.sendFile(file.path, { root: 'uploads' });
  }
}
