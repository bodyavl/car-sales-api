import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators';
import { AccessTokenGuard, RefreshTokenGuard } from 'src/auth/guard';
import { CreateUserDto, UpdateUserDto } from './dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findMe(@GetUser('id') id: number) {
    return this.userService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Patch()
  async update(@GetUser('id') id: number, @Body() user: UpdateUserDto) {
    return this.userService.update(id, user);
  }

  @UseGuards(RefreshTokenGuard)
  @Delete()
  async delete(@GetUser('id') id: number) {
    return this.userService.delete(id);
  }
}
