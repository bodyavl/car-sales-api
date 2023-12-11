import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AccessTokenStrategy } from '../auth/strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';

@Module({
  exports: [UserService],
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, AccessTokenStrategy, IsExist, IsNotExist],
})
export class UserModule {}
