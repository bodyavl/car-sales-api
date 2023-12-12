import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateCarDto {
  @ApiProperty({ example: 'Toyota' })
  @IsOptional()
  @IsString()
  carManufacturer?: string;

  @ApiProperty({ example: 'Camry' })
  @IsOptional()
  @IsString()
  carModel?: string;

  @ApiProperty({ example: 2020 })
  @IsOptional()
  @IsNumberString()
  year?: number;

  @ApiProperty({
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '1HGBH41JXMN109186' })
  @IsOptional()
  @IsString()
  @Matches(/^[A-HJ-NPR-Z0-9]{17}$/, {
    message: 'VIN is not valid',
  })
  VIN?: string;
}
