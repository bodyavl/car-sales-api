import {
  IsString,
  IsEmail,
  IsOptional,
  Validate,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'test' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  name?: string;

  @ApiProperty({ example: 'test@gmail.com' })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => value.trim())
  @Validate(IsNotExist, ['User'], {
    message: 'emailAlreadyExists',
  })
  email?: string;

  @ApiProperty({ example: '12345678' })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}
