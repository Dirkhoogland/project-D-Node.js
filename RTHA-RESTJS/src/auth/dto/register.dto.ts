import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsEnum, IsOptional } from 'class-validator';
import { Role } from '../Roles/role.enum';

export class RegisterDto {

    @ApiProperty()
    @IsString()
    username: string;

    @ApiProperty()
    @IsString()
    password: string;

    @ApiProperty({ enum: Role, required: false })
    @IsEnum(Role, { message: 'Role must be either user, admin, or moderator' })
    @IsOptional()
    role?: Role;
    
}
