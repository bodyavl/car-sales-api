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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators';
import { AccessTokenGuard, RefreshTokenGuard } from 'src/auth/guard';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './user.types';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ type: User })
  @ApiUnauthorizedResponse()
  @ApiBearerAuth('access_token')
  @UseGuards(AccessTokenGuard)
  @Get()
  async findMe(@GetUser('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiOkResponse({ type: User })
  @ApiBadRequestResponse()
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @ApiBearerAuth('access_token')
  @ApiOkResponse({ type: User })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(AccessTokenGuard)
  @Patch()
  async update(@Body() user: UpdateUserDto, @GetUser('id') id: string) {
    return this.userService.update(id, user);
  }

  @ApiBearerAuth('refresh_token')
  @ApiOkResponse({ type: User })
  @ApiNotFoundResponse()
  @UseGuards(RefreshTokenGuard)
  @Delete()
  async delete(@GetUser('id') id: string) {
    return this.userService.delete(id);
  }
}
