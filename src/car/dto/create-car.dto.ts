import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateCarDto {
  @ApiProperty({ example: 'Toyota' })
  @IsNotEmpty()
  @IsString()
  carManufacturer: string;

  @ApiProperty({ example: 'Camry' })
  @IsNotEmpty()
  @IsString()
  carModel: string;

  @ApiProperty({ example: 2020 })
  @IsNotEmpty()
  @IsNumberString()
  year: number;

  @ApiProperty({
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ example: '1HGBH41JXMN109186' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-HJ-NPR-Z0-9]{17}$/, {
    message: 'VIN is not valid',
  })
  VIN: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  images?: Array<Express.Multer.File>;
}
