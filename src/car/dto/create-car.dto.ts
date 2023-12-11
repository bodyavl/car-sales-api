import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateCarDto {
  @IsNotEmpty()
  @IsString()
  carManufacturer: string;

  @IsNotEmpty()
  @IsString()
  carModel: string;

  @IsNotEmpty()
  @IsNumberString()
  year: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-HJ-NPR-Z0-9]{17}$/, {
    message: 'VIN is not valid',
  })
  VIN: string;
}
