import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'Mex' })
    username: string;

    @ApiProperty({ example: 'MP14' })
    password: string;
}
