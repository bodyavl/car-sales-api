import { IsString, IsEmail, IsOptional, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  name?: string;

  @IsOptional()
  @IsEmail()
  @Validate(IsNotExist, ['User'], {
    message: 'emailAlreadyExists',
  })
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;
}
