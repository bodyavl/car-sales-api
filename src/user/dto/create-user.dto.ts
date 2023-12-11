import {
  IsString,
  IsEmail,
  MinLength,
  IsNotEmpty,
  Validate,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'test' })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  name: string;

  @ApiProperty({ example: 'test@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  @Validate(IsNotExist, ['User'], {
    message: 'emailAlreadyExists',
  })
  email: string;

  @ApiProperty({ example: '12345678' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
