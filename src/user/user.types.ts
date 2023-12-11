import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'test@gmail.com' })
  email: string;

  @ApiProperty({ example: 'test' })
  name: string;
}
