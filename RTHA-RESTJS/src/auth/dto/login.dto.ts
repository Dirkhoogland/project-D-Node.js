import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'Admin' })
  username: string;

  @ApiProperty({ example: 'Admin' })
  password: string;
}
